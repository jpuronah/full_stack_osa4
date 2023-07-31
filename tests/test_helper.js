const Blog = require('../models/blog')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  //console.log('USERS IN DB', users)
  return users.map(u => u.toJSON())
}

const initialBlogs = [
  {
    title: 'Titteli',
    author: 'Author R. A.',
    url: 'www.www.fi',
    likes: 123
  },
  {
    title: 'asdadsdsa',
    author: 'Author Radsdsadasdas. A.',
    url: 'www.www.f3e32rer32i',
    likes: 123123132321
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'poistuupiantämä'})
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
