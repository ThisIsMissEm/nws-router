
var ws = require("websocket-server")
  , router = require("nws-router");

var server = ws.createServer({
  debug: true
});

server.use(router);

// Our events:
server.on('/', function(connection){

});

server.on('/chat/:room', function(connection, params){
  connection.storage.push("channels", params["room"]);
  
  // do the various logic.
  connection.addListener("message", function(message){
    app.send("/chat/"+params["room"], message);
  });
});

server.listen(8080);