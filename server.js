const http = require('http');

const [argDelay = 500, argTime = 2500] = process.argv.slice(2);
let interval;

const getDate = () => new Date().toUTCString();

const timeInterval = (delay, time) =>
  new Promise((resolve, reject) => {
    interval = setInterval(() => {
      time -= delay;

      const date = getDate();

      console.log(date);

      if (time <= 0) {
        clearInterval(interval);
        resolve(date);
      }
    }, delay);
  });

const server = http.createServer().listen(8080);

server.on('request', async (req, res) => {
  if (req.method === 'GET') {
    if (interval) {
      clearInterval(interval);
    }

    const date = await timeInterval(argDelay, argTime);

    res.end(date);
  } else {
    res.end();
  }
});
