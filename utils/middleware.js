const logger = require('./logger')
//const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token
  next()
}
/*
const userExtractor = async (request, response, next) => {
  console.log('USER EXTRACTOR')
  //await tokenExtractor(request, response)
  const token = getTokenFrom(request)
  //const token = request.token// tokenExtractor(request)// request.token
  console.log('token', token)
  if (!token) {
    return response.status(401).json({ error: 'Token missing' })
  }
  const userOfToken = jwt.verify(token, process.env.SECRET)
  console.log(userOfToken)
  if (!userOfToken.id) {
    return response.status(401).json({ error: 'Invalid token ' })
  }
  request.user = userOfToken
  next()
}*/

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing oor invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
  //,userExtractor
}