const app = require('../src/app')

describe ('App', () => {
 
    it('GET / responds with 401 error', () => {
      return supertest(app)
        .get('/')
        .expect(401, {error: 'Unauthorized request'})
    })

    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
        .expect(200, 'Hello, world!')
    })
  
})


