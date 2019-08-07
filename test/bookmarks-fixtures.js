function makeBookmarksArray() {
  return [
    {
      id: 0,
      title: 'Google',
      url: 'http://www.google.com',
      rating: '3',
      desc: 'Internet-related services and products.'
    },
    {
      id: 1,
      title: 'Thinkful',
      url: 'http://www.thinkful.com',
      rating: '5',
      desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
    },
    {
      id: 2,
      title: 'Github',
      url: 'http://www.github.com',
      rating: '4',
      desc: 'brings together the world\'s largest community of developers.'
    }
  ]
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: 'https://www.hackers.com',
    desc: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1,
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    desc: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark
}