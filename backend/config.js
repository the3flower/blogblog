const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    uri: process.env.URI,
    port: process.env.PORT,
};
