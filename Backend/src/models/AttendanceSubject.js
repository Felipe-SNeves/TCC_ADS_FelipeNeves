const websocket = require ('ws');

class AttendanceSubject {
    
    constructor (port) {
        
        this.room = new websocket.WebSocketServer ({port: port});
        this.observerCollection = [];

        const log = (message) => {
            console.log (message);
        };

        const notifyObservers = (message) => {
            log ("Calling observers!");
            this.observerCollection.forEach ((webpoint) => {
                webpoint.send (JSON.stringify (message));
            });
        };

        this.notify = notifyObservers;

        this.room.on ('connection', (ws) => {
            ws.on ('close', () => {
                log ("Unsubscribing observer!");
                ws.close ();
            });

            ws.on ('error', (error) => {
                log ("An error ocurred: " + error);
            });

            ws.on ('message', (message) => {
                log ("Received raw data: " + message);

                let data = JSON.parse (message);

                switch (data.type) {
                    case "register":
                        this.observerCollection.push (ws);
                        break;
                    case "unregister":
                        this.observerCollection = this.observerCollection.filter ((wsLista) => {
                            return ws !== wsLista;
                        });
                }

                log ("Active clients: " + this.observerCollection);
            });
        });
    }
};

module.exports = AttendanceSubject;