import request from 'supertest'
import app from '@/main/config/app'
import { noCache } from '@/main/middlewares'

describe('NoCache Middleware', () => {
  it('should disable cache', async () => {
    app.get('/test-no-cache', noCache, (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
