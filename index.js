const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect('mongodb://localhost/auth', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const connection = mongoose.connection

connection.on('connected', () => {
	console.log('Connected to database')
})

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json({ type: '*/*' }))

const auth = require('./routes/auth')
app.use('/auth', auth)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server listening on port 3000'))
