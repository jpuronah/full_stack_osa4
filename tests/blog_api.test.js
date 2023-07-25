const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe(' TEST for json-format and blog count at /api/blogs ', () => {
  test('notes are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    console.log('RESPONSE', response.body)
    expect(response.body).toHaveLength(2)
  })
})

describe(' TEST correct ID format ', () => {
  test(' there is "id" ', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      //console.log("foreach: ", blog)
      expect(blog.id).toBeDefined()
    })
  })
  test(' there is NO "_id" ', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      //console.log("foreach: ", blog)
      expect(blog._id).toBeUndefined()
    })
  })
})

describe(' TEST http POST ', () => {
  test(' POST -> count gets bigger ', async () => {
    const newBlog = {
      title: 'Titteli',
      author: 'Author R. A.',
      url: 'www.www.fi',
      likes: 123
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    
    const response = await api.get('/api/blogs')
    const updatedBlogs = response.body

    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  })

  test(' correct blog is posted ', async () => {
    const newBlog = {
      title: 'Titteli',
      author: 'Author R. A.',
      url: 'www.www.fi',
      likes: 123
    }
    await api.post('/api/blogs').send(newBlog)
    const response = await api.get('/api/blogs')
    const updatedBlogs = response.body

    const addedBlog = updatedBlogs.find(blog => blog.title === newBlog.title)
    expect(addedBlog).toBeDefined
    expect(addedBlog.title).toBe(newBlog.title)
    expect(addedBlog.author).toBe(newBlog.author)
    expect(addedBlog.url).toBe(newBlog.url)
    expect(addedBlog.likes).toBe(newBlog.likes)
    
  })
})

describe(' TEST NULL likes ', () => {
  test(' if !likes -> likes = 0 ', async () => {
    const newBlog = {
      title: 'TIEETEEEEELL',
      author: 'aSDASASASAS R. A.',
      url: 'www.www.fi'
      //likes: 123
    }
    await api.post('/api/blogs').send(newBlog)
    const response = await api.get('/api/blogs')
    const updatedBlogs = response.body
    const addedBlog = updatedBlogs.find(blog => blog.title === newBlog.title)
    expect(addedBlog.likes).toBe(0)
  })
})

describe(' TEST posting invalid blog ', () => {
  test(' blog WITHOUT title ', async () => {
    const newBlog = {
      //title: 'TIEETEEEEELL',
      author: 'aSDASASASAS R. A.',
      url: 'www.www.fi',
      likes: 123
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
  test(' blog WITHOUT url ', async () => {
    const newBlog = {
      title: 'TIEETEEEEELL',
      author: 'aSDASASASAS R. A.',
      //url: 'www.www.fi'
      likes: 123
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})