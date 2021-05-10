const Koa = require('koa');
const io = require('socket.io-client');
const papa = require('papaparse');
const axios = require('axios');
const app = new Koa();
const socket = io('http://localhost:8081');

socket.on('connect', () => {
  socket.emit('join', 'bots');
});

socket.on('message', async ({ to = '', message = '' }) => {
  try {
    if (message.match(/^\/stock=/)) {
      const stockingResponse = await axios.get('http://localhost:8082/appl.us');
      papa.parse(stockingResponse.data, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (col) => col.trim().toLowerCase().replace(/\s/g, '_'),
        complete: (results) => {
          const [stock] = results.data;
          socket.emit('message', {
            to,
            message: `${stock.symbol} quote is $${stock.close} per share`
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    socket.emit('message', {
      to,
      message: 'command not found.'
    });
  }
});

app.listen(8083);
