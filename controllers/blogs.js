const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.post('/', async (request, response) => {
  console.log('BLOGSROUTER')
  const body = request.body
  //const user = request.user
  //console.log('USERTOKEN', user)
  const userOfToken = jwt.verify(request.token, process.env.SECRET)
  if (!userOfToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (!body.title || !body.url) {
    return response.status(400).json({error: 'Title or url missing' })
  }
  //console.log('BODY', body)
  //const user = await User.findById(body.userId)
  
  const user = await User.findById(userOfToken.id)
  
  //console.log('USER', user)
  //const users = await User.findById({})
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  
  if (!body.likes) {
    blog.likes = 0
  } else {
    blog.likes = body.likes
  }

  console.log('BLOG', blog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', '-blogs')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = request.body

  await Blog.findByIdAndUpdate(id, updatedBlog, {new: true})
  response.status(200).json(updatedBlog)
  return
})

blogsRouter.delete('/:id', async (request, response) => {
  const userOfToken = jwt.verify(request.token, process.env.SECRET)
  console.log('DECODED', userOfToken)
  if (!userOfToken.id || !request.token) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blog.user.toString() !== userOfToken.id.toString()) {
    return response.status(403).json({ error: 'You do not have rights to delete' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter