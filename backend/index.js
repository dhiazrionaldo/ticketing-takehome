const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// TODO: Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Ticketing Takehome Backend is running.');
});

// TODO: Check the server port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});