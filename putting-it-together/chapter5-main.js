const fs = require('fs');
const { Worker } = require('worker_threads');
const Canvas = require('../lib/canvas');

const workerCount = 4;
const canvasPixels = 1024;
let completedWorkers = 0;

const sharedBuffer = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * canvasPixels * canvasPixels);
const arr = new Float32Array(sharedBuffer);

const workers = [];
for (let i = 0; i < workerCount; i++) {
  const worker = new Worker('./chapter5-worker.js', {
    workerData: {
      workerIndex: i,
      workerCount: workerCount,
      canvasPixels: canvasPixels,
      start: (canvasPixels * canvasPixels) / workerCount * i,
      end: (canvasPixels * canvasPixels) / workerCount * (i + 1) - 1,
      data: arr,
    },
  });
  worker.on('message', (message) => {
    console.log(`Worker ${message.workerIndex} ${message.time}`);
    completedWorkers++;
    if (completedWorkers === workerCount) {
      const hrend = process.hrtime(hrstart);
      console.log(`Total Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);
    }
  });
  workers.push(worker);
}

const hrstart = process.hrtime();

for (let j = 0; j < workerCount; j++) {
  workers[j].postMessage('');
}
