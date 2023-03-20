import express from 'express'
// import setupApolloServer from './apollo-server'
import setupStaticFiles from './static-files'
import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app = express()
// setupApolloServer(app)
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
