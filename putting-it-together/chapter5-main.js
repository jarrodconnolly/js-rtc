// eslint-disable-next-line import/no-unresolved
const { Worker } = require('worker_threads');

const workerCount = 4;
const canvasPixels = 1024;
let completedWorkers = 0;

let hrstart;

const sharedBuffer = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * canvasPixels * canvasPixels);
const arr = new Float32Array(sharedBuffer);

function workerMessageCallback(message) {
  // eslint-disable-next-line no-console
  console.log(`Worker ${message.workerIndex} ${message.time}`);
  completedWorkers += 1;
  if (completedWorkers === workerCount) {
    const hrend = process.hrtime(hrstart);
    // eslint-disable-next-line no-console
    console.log(`Total Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);
  }
}

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

  worker.on('message', workerMessageCallback);
  workers.push(worker);
}

hrstart = process.hrtime();

for (let j = 0; j < workerCount; j++) {
  workers[j].postMessage('');
}
