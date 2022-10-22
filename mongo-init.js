db.createUser({
  user: 'mongo',
  pwd: 'mongo',
  roles: [
    {
      role: 'dbOwner',
      db: 'clean-node-api'
    }
  ]
})
