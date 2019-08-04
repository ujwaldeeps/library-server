const config = require("config");
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

let app = express();

const serverConfig = config.get("server");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(serverConfig.BASEURL, routes(express.Router()));

const start = () => {
    const port = serverConfig.get("port");
    return new Promise((resolve, reject) => {
        app.listen(port, () => {console.log("server listening to port " + port); resolve();});
    })
}
module.exports = {start, app};