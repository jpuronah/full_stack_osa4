const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/blog_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
  const listWithNoBlog = []
  test('of empty list is zero', () => {
    const result = totalLikes(listWithNoBlog)
    expect(result).toBe(0)
  })
  
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  
  const listWithManyBlog = [
    {title: 'Blogi_1', author: 'Author J.', url: 'www.url1.co.uk', likes: 10},
    {title: 'Blogi_2', author: 'Author K.', url: 'www.url2.co.uk', likes: 20},
    {title: 'Blogi_3', author: 'Author L.', url: 'www.url3.co.uk', likes: 30},
    {title: 'Blogi_4', author: 'Author M.', url: 'www.url4.co.uk', likes: 40}
  ]
  test('of a bigger list is calculated rigth', () => {
    const result = totalLikes(listWithManyBlog)
    expect(result).toBe(100)
  })
})

describe('favoriteBlog', () => {
  const listWithManyBlog = [
    {title: 'Blogi_1', author: 'Author J.', url: 'www.url1.co.uk', likes: 10},
    {title: 'Blogi_2', author: 'Author K.', url: 'www.url2.co.uk', likes: 20},
    {title: 'Blogi_3', author: 'Author L.', url: 'www.url3.co.uk', likes: 30},
    {title: 'Blogi_4', author: 'Author M.', url: 'www.url4.co.uk', likes: 40},
  ]
  test(' most liked blog ', () => {
    const result = favoriteBlog(listWithManyBlog)
    const correct = {title: 'Blogi_4', author: 'Author M.', url: 'www.url4.co.uk', likes: 40}
    //console.log('res', result)
    //console.log('cor', correct)
    expect(result).toEqual(correct)
  })
})

describe('mostBlogs', () => {
  const listWithManyBlog = [
    {title: 'Blogi_1', author: 'Author J.', url: 'www.url1.co.uk', likes: 10},
    {title: 'Blogi_2', author: 'Author K.', url: 'www.url2.co.uk', likes: 20},
    {title: 'Blogi_3', author: 'Author L.', url: 'www.url3.co.uk', likes: 30},
    {title: 'Blogi_4', author: 'Author J.', url: 'www.url4.co.uk', likes: 40},
  ]
  test(' most blogged author ', () => {
    const result = mostBlogs(listWithManyBlog)
    const correct = {
      author: 'Author J.',
      blogs: 2
    }
    //console.log('res', result)
    //console.log('cor', correct)
    expect(result).toEqual(correct)
  })
})

describe('mostLikes', () => {
  const listWithManyBlog = [
    {title: 'Blogi_1', author: 'Author J.', url: 'www.url1.co.uk', likes: 10},
    {title: 'Blogi_2', author: 'Author K.', url: 'www.url2.co.uk', likes: 20},
    {title: 'Blogi_3', author: 'Author L.', url: 'www.url3.co.uk', likes: 30},
    {title: 'Blogi_4', author: 'Author J.', url: 'www.url4.co.uk', likes: 40},
  ]
  test(' most liked author ', () => {
    const result = mostLikes(listWithManyBlog)
    const correct = {
      author: 'Author J.',
      likes: 50
    }
    //console.log('res', result)
    //console.log('cor', correct)
    expect(result).toEqual(correct)
  })
})

