const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
//const http = require('http')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const morgan = require('morgan')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB: ', error.message)
  })

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
