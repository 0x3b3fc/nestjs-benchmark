const fastify = require('fastify')({
  logger: {
    level: 'error'
  }
});
const fs = require('fs');
const { Transform } = require('stream');
const port = 3001;

// JSON transformation stream
const createJsonTransform = () => {
  return new Transform({
    transform(chunk, encoding, callback) {
      const data = { 
        timestamp: Date.now(),
        data: chunk.toString()
      };
      this.push(JSON.stringify(data) + '\n');
      callback();
    }
  });
};

// Basic route
fastify.get('/ping', async (request, reply) => {
  return { message: 'pong' };
});

// JSON stream route
fastify.get('/stream', async (request, reply) => {
  reply.header('Content-Type', 'application/json');
  
  const readStream = fs.createReadStream('data.txt');
  const transform = createJsonTransform();
  
  readStream
    .on('error', (error) => {
      console.error('Read error:', error);
      reply.status(500).send();
    });
    
  transform
    .on('error', (error) => {
      console.error('Transform error:', error);
      reply.status(500).send();
    });
    
  await new Promise((resolve, reject) => {
    readStream
      .pipe(transform)
      .pipe(reply.raw)
      .on('finish', resolve)
      .on('error', reject);
  });
  
  return reply;
});

// Large JSON response
fastify.get('/large', async (request, reply) => {
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: `Item ${i}`,
    timestamp: Date.now()
  }));
  return data;
});

// Memory-efficient large response
fastify.get('/large-stream', async (request, reply) => {
  reply.header('Content-Type', 'application/json');
  reply.raw.write('[');
  
  let first = true;
  for (let i = 0; i < 10000; i++) {
    const data = {
      id: i,
      value: `Item ${i}`,
      timestamp: Date.now()
    };
    
    if (!first) {
      reply.raw.write(',');
    }
    first = false;
    reply.raw.write(JSON.stringify(data));
  }
  
  reply.raw.end(']');
  return reply;
});

const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Fastify server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();