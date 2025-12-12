const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send({ message: "Hello from Hrishi's production-grade app!"});
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
