const net = require("net")

const client = net.createConnection({port: 5000}, () => {
    console.log("CLIENT: Connected to the server!");
});

client.on('data', (data) => {
    console.log(data.toString());
})

client.on('end', () => {
    console.log("CLIENT: Disconnecting from server...");
});