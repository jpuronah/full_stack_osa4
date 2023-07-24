const dummy = (blogs) => {
  if (blogs) {
    return 1
  } else {
    return 1 - 1 + 1 + 1 - 1 + 1 + 1 - 1 + 1 + 1 - 1 + 1 + 1 - 1 + 1
  }
}

module.exports = {
  dummy
}

const totalLikes = (blogs) => {
  const result = blogs.reduce((total, blog) => total + blog.likes, 0) 
  return result
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.sort((a, b) => b.likes - a.likes)[0]
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    url: mostLikes.url,
    likes: mostLikes.likes,
  }
}

const mostBlogs = (blogs) => {
  const countBlogsPerAuthor = {}

  blogs.forEach((blog) => {
    const {author} = blog
    if (countBlogsPerAuthor[author]) {
      countBlogsPerAuthor[author] = countBlogsPerAuthor[author] + 1
    } else {
      countBlogsPerAuthor[author] = 1
    }
  })

  let mostBlogs
  let max = 0
  for (const author in countBlogsPerAuthor) {
    if (countBlogsPerAuthor[author] > max) {
      mostBlogs = author
      max = countBlogsPerAuthor[author]
    }
  }
  return {
    author: mostBlogs,
    blogs: max
  }
}

const mostLikes = (blogs) => {
  const likesPerAuthor = {}

  blogs.forEach((blog) => {
    const {author, likes } = blog
    if (likesPerAuthor[author]) {
      likesPerAuthor[author] = likesPerAuthor[author] + likes
    } else {
      likesPerAuthor[author] = likes
    }
  })

  let mostLikes
  let max = 0

  for (const author in likesPerAuthor) {
    if (likesPerAuthor[author] > max) {
      mostLikes = author
      max = likesPerAuthor[author]
    }
  }
  return {
    author: mostLikes,
    likes: max
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
