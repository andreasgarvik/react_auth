const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config')
const router = require('express').Router()
const passportService = require('../services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

const token = user => {
	const time = new Date().getTime()
	return jwt.sign({ sub: user.id, iat: time }, config.secret)
}

router.post('/signup', (req, res, next) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res
			.status(422)
			.send({ error: 'You must provide email and password' })
	}

	User.findOne({ email }, (err, existingUser) => {
		if (err) {
			return next(err)
		}

		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' })
		}

		const user = new User({
			email,
			password
		})

		user.save((err, user) => {
			if (err) {
				return next(err)
			}
			res.send({ token: token(user) })
		})
	})
})

router.post('/signin', requireSignin, (req, res, next) => {
	res.send({ token: token(req.user) })
})

router.get('/', requireAuth, (req, res) => {
	res.send('hi there')
})

module.exports = router
