const express = require('express');
const fs = require('fs');
const { Transform } = require('stream');
const app = express();
const port = 3000;

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
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// JSON stream route
app.get('/stream', (req, res) => {
  const readStream = fs.createReadStream('data.txt');
  const transform = createJsonTransform();
  
  res.setHeader('Content-Type', 'application/json');
  readStream
    .on('error', (error) => {
      console.error('Read error:', error);
      res.status(500).end();
    })
    .pipe(transform)
    .on('error', (error) => {
      console.error('Transform error:', error);
      res.status(500).end();
    })
    .pipe(res)
    .on('error', (error) => {
      console.error('Write error:', error);
      res.status(500).end();
    });
});

// Large JSON response
app.get('/large', (req, res) => {
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: `Item ${i}`,
    timestamp: Date.now()
  }));
  res.json(data);
});

// Memory-efficient large response
app.get('/large-stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.write('[');
  
  let first = true;
  for (let i = 0; i < 10000; i++) {
    const data = {
      id: i,
      value: `Item ${i}`,
      timestamp: Date.now()
    };
    
    if (!first) {
      res.write(',');
    }
    first = false;
    res.write(JSON.stringify(data));
  }
  
  res.end(']');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});