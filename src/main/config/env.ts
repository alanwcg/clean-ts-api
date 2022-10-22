export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:mongo@mongo:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '85cb92ab2fab4aa70fa837f778de874b'
}
