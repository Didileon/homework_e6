const http = require("http");
const ws = require("ws");
const wss = new ws.Server({ noServer: true });
const fs = require("fs");
const path = require("path");
const PORT = 8090;

function accept(req, res) {
    if (req.headers.upgrade) {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0),
    onSocketConnect);

    }
    else if (req.url == "/") {
        fs.createReadStream("./chat.html").pipe(res);

    } else if (path.extname(req.url) == ".js") {
        let js = path.join(__dirname + req.url);
        fs.createReadStream(js).pipe(res);
    } else if (path.extname(req.url) == ".css") {
        let css = path.join(__dirname + req.url);
        fs.createReadStream(css).pipe(res);
    }
}

function onSocketConnect(ws) {
    ws.on("message", function(message, isBinary) {
        console.log("New connection");
        console.log("isBinary: " + isBinary);
        console.log("Message received: " + message);

        let object = JSON.parse(message);
        console.log(object);
        ws.send(JSON.stringify(object));

    });
    ws.on("close", function () {
        console.log("Connection closed");

    });
}

http.createServer(accept).listen(PORT);