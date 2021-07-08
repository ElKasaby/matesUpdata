require("dotenv").config();

const server = require("./server");

(() => {
    server.up(function () {
      console.info("Server is listening at", this.address().port);
      console.info("Enjoy!");
    });
})();
