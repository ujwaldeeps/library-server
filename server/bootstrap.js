const server = require("./server");
const bootstrap = async () => {
    await server.start();
    return server.app;
};

module.exports = bootstrap;