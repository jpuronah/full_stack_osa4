const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')

blogsRouter.post('/', async (request, response) => {
  //console.log('BLOGSROUTER')
  const userOfToken = request.user
  if (!userOfToken.id) {
    return response.status(401).json({ error: 'user not found' })
  }
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).json({error: 'Title or url missing' })
  }
  
  const user = await User.findById(userOfToken.id)
  
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

  //console.log('BLOG', blog)
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
  //console.log('GETGETGETGETGET')
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
  const userOfToken = request.user
  if (!userOfToken.id) {
    return response.status(401).json({ error: 'user not found' })
  }
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).json({error: 'Title or url missing' })
  }
  
  const user = await User.findById(userOfToken.id)

  const id = request.params.id
  //const updatedBlog = request.body
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }
  
  if (!body.likes) {
    updatedBlog.likes = 0
  } else {
    updatedBlog.likes = body.likes
  }
  
  await Blog.findByIdAndUpdate(id, updatedBlog, {new: true})
  response.status(200).json(updatedBlog)
})
//const jwt = require('jsonwebtoken')
blogsRouter.delete('/:id', async (request, response) => {
  const userOfToken = request.user
  if (!userOfToken.id) {// || !request.token) {
    return response.status(401).json({ error: 'user not found' })
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