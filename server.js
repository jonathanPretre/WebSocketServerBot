var WebSocket = require('websocket').server;
var http = require('http');

var server = http.createServer(function (req, res){
    //console.log((new Date()) + ' Received request for ' + req.url);
    res.writeHead(404);
    res.end();
})

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
//server.listen(8080);

wsServer = new WebSocket({httpServer: server});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}

wsServer.on('request', function(request) {
     
    var connection = request.accept('echo-protocol', request.origin);
    
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function(message) {
        var jsonReceive = JSON.parse(message.utf8Data);
        if (jsonReceive.text != "") 
        {        
            console.log('Received Message: ' + jsonReceive.text);
            
            var jsonstring = {"text":"","type":"bot","success":true};
            
            //jsonstring.message = AnalystMessage(jsonstring);
            var json = JSON.stringify(AnalystMessage(jsonReceive.text));
            connection.send(json);
        }
    });
    
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function AnalystMessage(messageReceive){
    var jsonstring = {"text":"","type":"message","success":true};
    var regex1 = /^bot\s/;
    var regex2 = /^@bot\s/;
    var regex3 = /^bot:\s/;
    if(regex1.test(messageReceive) || regex2.test(messageReceive) || regex3.test(messageReceive) )
        {
            if(/ping$/.test(messageReceive))
            {
                jsonstring.text = "pong";
                jsonstring.type = "bot";
                jsonstring.success = true;
                return jsonstring;
            }
            else
            {
                jsonstring.text = "Error bot cmd";
                jsonstring.type = "bot";
                jsonstring.success = true;
                return jsonstring;
            }
        }
    else
    {
            jsonstring.text = messageReceive;
            jsonstring.type = "message";
            jsonstring.success = true;
            return jsonstring;
    }
}
