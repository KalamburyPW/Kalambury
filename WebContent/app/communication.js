/**
 * SERVER COMMUNICATION
 */

const STATUS = {
    OK: 'OK',
    ERROR: 'ERROR'
}

const EVENT_TYPE = {
    DRAW: 'DRAW',   // use it for drawing on canvas
    AUTH: 'AUTH',   // use it to send user's login and start new session
    CHAT: 'CHAT',   // use it to pass chat messages
    KEYWORD: 'KEYWORD', // send new keyword for user to draw
    CLEAR: 'CLEAR', // clear canvas for all the users
    RESET: 'RESET', // reset the game
    WS_OPEN: 'WS_OPEN', // use it on opening new websocket connection
    WS_CLOSE: 'WS_CLOSE',   // use it on closing current websocket connection 
}

function prepareWebsocketMessage(status, eventType, data) {
    if (status == null || eventType == null) {
        console.error('[prepareWebsocketMessage] status and event type are mandatory');
        return;
    }
    const msg = {
        status: status,
        eventType: eventType,
        data: data
    }
    if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(msg));
    }
}
