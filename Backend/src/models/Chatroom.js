const websocket = require ('ws');

class Chatroom {

    constructor (port) {
        this.bidirectionalConnection = new websocket.WebSocketServer ({ port: port });
        this.webPoint1;
        this.webPoint2;
        const log = (message) => {
            console.log (message);
        }

        const sendTo = (webpoint, message) => {
            log ("Sent " + message.type + " to " + webpoint.name);
            webpoint.send (JSON.stringify (message));
        }
    
        log ("Opened the room!");
        
        this.bidirectionalConnection.on ('connection', (ws) => {

            ws.on ('message', (message) => {

                log ("Recived raw message: " + message);
                let data = JSON.parse (message);

                switch (data.type) {
                    case "saudacao":
                        if (this.webPoint1 === undefined) {
                            ws.name = "H1";
                            this.webPoint1 = ws;
                        }
                        else {
                            ws.name = "H2";
                            this.webPoint2 = ws;
                        }
                        log (ws.name + " sauda o servidor!");
                        break;
                    case "offer":
                        log ("Received offer from " + ws.name);
                        sendTo ((ws.name === "H1") ? this.webPoint2 : this.webPoint1, { type: "offer", offer: data.offer });
                        break;
                    case "answer":
                        log ("Received answer from " + ws.name);
                        sendTo ((ws.name === "H1") ? this.webPoint2 : this.webPoint1, { type: "answer", answer: data.answer });
                        break;
                    case "candidate":
                        log ("Received candidates from " + ws.name);
                        sendTo ((ws.name === "H1") ? this.webPoint2 : this.webPoint1, { type: "candidate", candidate: data.candidate });
                }
            })

            ws.on ('error', (error) => {
                log ("An error ocurred: " + error);
            })

            ws.on ('close', () => {
                log ("Closing connection with: " + ws.name);
                ws.close ();
                this.bidirectionalConnection.close ();
            })
        });
    }
}

module.exports = Chatroom;