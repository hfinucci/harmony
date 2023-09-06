import fastify from 'fastify'
import fastifyIO from "fastify-socket.io";
import cors from '@fastify/cors'


const { ADDRESS = 'localhost', PORT = '3000' } = process.env;

const server = fastify()
server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
  server.register(fastifyIO, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }
  });

server.get('/ping', async (request, reply) => {
  return 'hola mundo!\n'
})

server.ready().then(() => {
    server.io.on("connect", (socket) => {
        console.log("a new client has connected!")
        console.log(socket.id)
        socket.on("disconnect", () => {
            console.log("a client has disconnected!")
        })
        socket.on("presskey", (payload) => {
            console.log(payload)
            socket.broadcast.emit("presskey", payload);
        });
    });
    
});

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, function (err, address) {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})