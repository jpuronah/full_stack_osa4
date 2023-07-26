const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  //console.log('beforeEach')
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe(' TEST for json-format and blog count at /api/blogs ', () => {
  test('notes are returned as JSON', async () => {
    //console.log('notes are returned as JSON')
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are two blogs', async () => {
    //console.log('there are two blogs')
    const response = await api.get('/api/blogs')
    //console.log('RESPONSE', response.body)
    expect(response.body).toHaveLength(2)
  })
})

describe(' TEST correct ID format ', () => {
  test(' there is "id" ', async () => {
    //console.log('there is "id"')
    const response = await api.get('/api/blogs')
    //console.log("id", response)
    response.body.forEach((blog) => {
      ////console.log("foreach: ", blog)
      expect(blog.id).toBeDefined()
    })
  })
  test(' there is NO "_id" ', async () => {
    //console.log('there is NO "_id"')
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      ////console.log("foreach: ", blog)
      expect(blog._id).toBeUndefined()
    })
  })
})

describe(' TEST http POST ', () => {
  test(' POST -> count gets bigger ', async () => {
    //console.log('POST -> count gets bigger')
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
    //console.log('correct blog is posted')
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
    //console.log('if !likes -> likes = 0')
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
    //console.log('blog WITHOUT title')
    const newBlog = {
      //title: 'TIEETEEEEELL',
      author: 'aSDASASASAS R. A.',
      url: 'www.www.fi',
      likes: 123
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
  test(' blog WITHOUT url ', async () => {
    //console.log('blog WITHOUT url')
    const newBlog = {
      title: 'TIEETEEEEELL',
      author: 'aSDASASASAS R. A.',
      //url: 'www.www.fi'
      likes: 123
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe(' TEST http DELETE ', () => {
  test(' DELETE -> count gets smaller ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlogs = response.body
    const idOfDeleted = initialBlogs[0].id

    //console.log(initialBlogs)
    //console.log(idOfDeleted)
    await api
      .delete(`/api/blogs/${idOfDeleted}`)
      .expect(204)

    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body

    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length - 1)
    //expect(updatedBlogs.map(blog => blog.id)).not.toContain(idOfDeleted)
  })
  test(' correct blog is deleted ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlogs = response.body
    const idOfDeleted = initialBlogs[0].id

    //console.log(initialBlogs)
    //console.log(idOfDeleted)
    await api
      .delete(`/api/blogs/${idOfDeleted}`)
      .expect(204)
    
    //const response = await api.get('/api/blogs')
    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body

    //expect(updatedBlogs).toHaveLength(helper.initialBlogs.length - 1)
    expect(updatedBlogs.map(blog => blog.id)).not.toContain(idOfDeleted)
    
  })
})

describe(' TEST http PUT ', () => {
  test(' PUT -> likes increase by one ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlog = response.body[0]
    const idOfModified = initialBlog.id

    const modifiedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: initialBlog.url,
      likes: initialBlog.likes + 1
    }
    await api
      .put(`/api/blogs/${idOfModified}`)
      .send(modifiedBlog)
      .expect(200)
    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body
    //console.log(updatedBlogs)
    //console.log(updatedBlogs[0].likes, modifiedBlog.likes)
    expect(updatedBlogs[0].likes).toBe(modifiedBlog.likes)
  })
  test(' PUT -> url is changed ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlog = response.body[0]
    const idOfModified = initialBlog.id

    const modifiedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: 'www.modified_url.com',
      likes: initialBlog.likes
    }
    await api
      .put(`/api/blogs/${idOfModified}`)
      .send(modifiedBlog)
      .expect(200)
    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body
    //console.log(updatedBlogs)
    //console.log(initialBlog.url, updatedBlogs[0].url, modifiedBlog.url)
    expect(updatedBlogs[0].url).toBe(modifiedBlog.url)
  })
  test(' PUT -> author is changed ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlog = response.body[0]
    const idOfModified = initialBlog.id

    const modifiedBlog = {
      title: initialBlog.title,
      author: 'Modifi Ed A. Uthor',
      url: initialBlog.url,
      likes: initialBlog.likes
    }
    await api
      .put(`/api/blogs/${idOfModified}`)
      .send(modifiedBlog)
      .expect(200)
    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body
    //console.log(updatedBlogs)
    //console.log(initialBlog.author, updatedBlogs[0].author, modifiedBlog.author)
    expect(updatedBlogs[0].author).toBe(modifiedBlog.author)
  })
  test(' PUT -> title is changed ', async () => {
    const response = await api.get('/api/blogs')
    const initialBlog = response.body[0]
    const idOfModified = initialBlog.id

    const modifiedBlog = {
      title: 'Modified title',
      author: initialBlog.author,
      url: initialBlog.url,
      likes: initialBlog.likes
    }
    await api
      .put(`/api/blogs/${idOfModified}`)
      .send(modifiedBlog)
      .expect(200)
    const updatedResponse = await api.get('/api/blogs')
    const updatedBlogs = updatedResponse.body
    //console.log(updatedBlogs)
    //console.log(initialBlog.title, updatedBlogs[0].title, modifiedBlog.title)
    expect(updatedBlogs[0].title).toBe(modifiedBlog.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
