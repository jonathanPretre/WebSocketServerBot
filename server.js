var WebSocket = require('ws').Server;
var http = require('http');

const PORT = process.env.PORT || 9030;

wsServer = new WebSocket({port: PORT});

wsServer.on('connection', function(ws) {
    
    console.log((new Date()) + ' Connection accepted.');
    
    ws.on('message', function(message) {
        var jsonReceive = JSON.parse(message);
        if (jsonReceive.text != "") 
        {        
            console.log('Received Message: ' + jsonReceive.text);
            
            var jsonstring = {"text":"","type":"bot","success":true};
            
            var json = JSON.stringify(AnalystMessage(jsonReceive.text));
            ws.send(json);
        }
    });
    
    ws.on('close', function(reasonCode, description) {
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
