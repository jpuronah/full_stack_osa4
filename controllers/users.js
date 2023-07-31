const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!password) {
    //console.log('NO PASSWORD')
    return response.status(400).json({ error: 'password non-existent'})
  } if (password.length < 3) {
    //console.log('PASSWORD TOO SHORT')
    return response.status(400).json({ error: 'password too short'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = new User({
    username,
    name,
    passwordHash
  })
  //console.log(user)

  const savedUser = await user.save()

  //console.log('USER POST RESPONSE')
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter
