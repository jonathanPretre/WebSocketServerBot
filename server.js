var WebSocket = require('ws').Server;
var http = require('http');

const PORT = process.env.PORT || 9030;

console.log((new Date()) + ' port :' + PORT);

wsServer = new WebSocket({port: PORT});

wsServer.on('connection', function(ws) {
    
    console.log((new Date()) + ' Connection accepted.');
    
    ws.on('message', function(message) {
        var jsonReceive = JSON.parse(message);
        if (jsonReceive.text != "") 
        {        
            console.log('Received Message: ' + jsonReceive.text);
            
            //var jsonstring = {"text":"","type":"bot","success":true};
            var json = AnalystMessage(jsonReceive.text);
            console.log("success : " + json.success + " text : " + json.text + " type: " + json.type);
            
            //if(json.type === "message"){
                wsServer.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        console.log("Envoie Broadcast : success : " + json.success + " text : " + json.text + " type : " + json.type);
                        client.send(JSON.stringify(json));
                    }
                    else
                    {
                        client.send(JSON.stringify(json));
                        console.log("Envoie Broadcast avec erreur : success : " + json.success + " text : " + json.text + " type : " + json.type);
                    }
                });
            //}
            //else{
                //console.log("Envoie Single : success : " + json.success + " text : " + json.text + " type : " + json.type);
                //ws.send(JSON.stringify(json));
            //}
        }
    });
    
    ws.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + ws.remoteAddress + ' disconnected.');
    });
});

function AnalystMessage(messageReceive){
    var jsonstring = {"text":"","type":"message","success":true};
    var regex1 = /^bot\s/;
    var regex2 = /^@bot\s/;
    var regex3 = /^bot:/;
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
                jsonstring.text = messageReceive;
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
