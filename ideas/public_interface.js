
var ws_router = require("ws_router");
var app = ws_router.createServer();

app.on('/', function(connection){

});

app.on('/chat/:room', function(connection, params){
  connection.storage.push("channels", params["room"]);
  
  // do the various logic.
  connection.addListener("message", function(message){
    app.send("/chat/"+params["room"], message);
  });
});

app.listen(8080);