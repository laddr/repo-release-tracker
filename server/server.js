// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true })


fastify.register(require('fastify-cors'), { 
  origin: "*",
})
fastify.register(require('fastify-redis'), { host: '127.0.0.1' })

// Declare a route
fastify.get("/", async (request, reply) => {
  const { redis } = fastify
  return { hello: "world" }
})

fastify.get("/api/repos", async (req, res) => {
  const { redis } = fastify
  redis.get(req.query.key, (err,val) => {
    res.send(err || val)
  })
})

fastify.post("/api/repos", async (req, res) => {
  const { redis } = fastify
  console.log(req)
  redis.set(req.body.key, JSON.stringify(req.body.value), (err) => {
    res.send(err || {status: "ok"})
  })
})

fastify.get("/api/repos/delete", async (req, res) => {
  const { redis } = fastify
  redis.del(req.query.key, (err) => {
    res.send(err || {status: "DEL OK"})
  })
})

fastify.get("/api/clearall", async (req, res) => {
  const { redis } = fastify
  redis.flushdb((err) => {
    res.send(err || {status: "All Cleared"})
  })
})

// Run the server
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()