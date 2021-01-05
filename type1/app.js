const express = require('express');
const app = express();
var helmet = require('helmet');
app.use(helmet());
// Serve static files out of the 'public' folder
app.use(express.static('public'));
// Serve the index.html when users access the 
// root directory using res.sendFile()
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.htm')
})*/
app.listen(5000);