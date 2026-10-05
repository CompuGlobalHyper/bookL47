const dotenv = require("dotenv").config();
const { SquareClient, SquareEnvironment } = require("square");

const squareClient = new SquareClient({
    token: process.env.SQUARE_PRODUCTION_ACCESS_TOKEN,
    environment: SquareEnvironment.Production,
});

module.exports = squareClient;