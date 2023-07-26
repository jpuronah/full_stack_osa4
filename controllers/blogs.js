const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { requestLogger } = require('../utils/middleware')

/*
const app = require('../app')
const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({error: 'Title or url missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  if (!body.likes) {
    blog.likes = 0
  } else {
    blog.likes = body.likes
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  
  console.log("PUT", body)
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlogDoc = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true})
  if (!updatedBlogDoc) {
    return response.status(404).json()
  }
})

module.exports = blogsRouter