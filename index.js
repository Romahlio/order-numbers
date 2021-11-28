const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// get home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// get app.js
app.get('/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/app.js'));
});

// get styles.css
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/styles.css'));
});

// get all orders
app.get('/orders', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const parsedData = JSON.parse(data);
    const orders = Object.values(parsedData.orders);
    res.status(200).send(orders);
  });
});

// get order by id
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const parsedData = JSON.parse(data);
    const {count, orders} = parsedData;

    if (count.total < id) {
      res.status(500).send({
        message: 'Order ID does not exist',
      });
      return;
    }

    res.status(200).send(orders[id]);
  });
});

const acceptedTypes = ['delivery', 'pickup'];
// create new order
app.post('/create', (req, res) => {
  const { type } = req.body;

  if (!type || !acceptedTypes.includes(type)) {
    res.status(500).send({
      message: 'Invalid order type',
    });
    return;
  }

  // read and parse JSON file
  const file = fs.readFileSync('data.json');
  const data = JSON.parse(file);

  // creat new order
  const newOrder = {
    id: ++data.count.total, // increment total order count
    type, 
    order_number: ++data.count[type], // increment type order count
    created: (new Date()).valueOf(),
  };

  data.orders[newOrder.id] = newOrder;

  // write new data to file
  fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) throw err;

    // send newly created order as response
    res.status(200).send(newOrder);
  });
});

// start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
