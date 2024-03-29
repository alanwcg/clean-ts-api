import request from 'supertest'
import app from '@/main/config/app'

describe('Body Parser Middleware', () => {
  it('should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Alan' })
      .expect({ name: 'Alan' })
  })
})
