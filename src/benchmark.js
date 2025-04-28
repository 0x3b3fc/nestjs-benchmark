const autocannon = require('autocannon');
const Table = require('cli-table3');

const EXPRESS_URL = 'http://localhost:3000';
const FASTIFY_URL = 'http://localhost:3001';

const routes = [
  '/ping',
  '/stream',
  '/large',
  '/large-stream'
];

const runBenchmark = async (url, route) => {
  const result = await autocannon({
    url: `${url}${route}`,
    connections: 100,
    duration: 10,
    pipelining: 1,
    workers: 4
  });

  return {
    rps: result.requests.average,
    latency: result.latency.average,
    throughput: result.throughput.average
  };
};

const formatNumber = (num) => {
  return Math.round(num).toLocaleString();
};

const compareFrameworks = async () => {
  const table = new Table({
    head: ['Route', 'Framework', 'Req/sec', 'Latency (ms)', 'Throughput (MB/s)']
  });

  for (const route of routes) {
    const express = await runBenchmark(EXPRESS_URL, route);
    const fastify = await runBenchmark(FASTIFY_URL, route);

    table.push(
      [`${route}`, 'Express', formatNumber(express.rps), formatNumber(express.latency), formatNumber(express.throughput / 1024 / 1024)],
      ['', 'Fastify', formatNumber(fastify.rps), formatNumber(fastify.latency), formatNumber(fastify.throughput / 1024 / 1024)]
    );
  }

  console.log('\nPerformance Benchmark Results:');
  console.log(table.toString());
};

// Generate sample data file
const fs = require('fs');
const generateData = () => {
  const stream = fs.createWriteStream('data.txt');
  for (let i = 0; i < 1000; i++) {
    stream.write(`Line ${i}: ${Date.now()}\n`);
  }
  stream.end();
};

generateData();
console.log('Starting benchmark...');
compareFrameworks().catch(console.error);