const http = require('http');

const [argDelay = 500, argTime = 2500] = process.argv.slice(2);

const timeInterval = (delay, time) =>
  new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      time -= delay;

      const D = new Date();
      const date = `${D.getUTCFullYear()}/${D.getUTCMonth()}/${D.getUTCDate()} ` +
        `${D.getUTCHours()}:${D.getUTCMinutes()}:${D.getUTCSeconds()}`;

      console.log(date);

      if (time <= 0) {
        clearInterval(interval);
        resolve(date);
      }
    }, delay);
  });

http.createServer((req, res) => {
  console.log('HTTP server running on port 8080');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end();
}).listen(8080);

http.get('http://localhost:8080/', async res => {
  console.log('Статус ответа: ' + res.statusCode);

  const date = await timeInterval(argDelay, argTime);

  res.on('data', () => date);
  res.on('end', () => {
    console.log(`Result: ${date}`);
  });
}).on('error', e => {
  console.log('Статус ошибки: ' + e.message);
});
