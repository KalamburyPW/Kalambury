var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var lastEvent;
var drawing = false;

/**
 * WEB SOCKET
 */

const socket = new WebSocket('ws://localhost:8080/Calamburs-0.0.1-SNAPSHOT/draw');

// Connection opened
socket.onopen = function (event) {

}

socket.onmessage = function (event) {
    readWebsocketMessage(JSON.parse(event.data));
}

/**
 * DRAWING
 */

canvas.onmousedown = function (event) {
    lastEvent = event;
    drawing = true;
}

canvas.onmouseup = function (event) {
    drawing = false;
}

canvas.onmousemove = function (event) {
    if (drawing === true) {

        const rect = canvas.getBoundingClientRect();
        const fromX = lastEvent.clientX - rect.left;
        const fromY = lastEvent.clientY - rect.top;
        const toX = event.clientX - rect.left;
        const toY = event.clientY - rect.top;

        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();

        sendStroke(fromX, fromY, toX, toY);

        lastEvent = event;
    }
}

canvas.onmouseleave = function (event) {
    drawing = false;
}

/**
 * EVENTS HANDLING 
 */

function onDraw(data) {
    if (data == null || data.from == null || data.to == null) {
        console.log('Wrong message!', data);
        return;
    }
    console.log('Message from server ', data);

    context.beginPath();
    context.moveTo(data.from.x, data.from.y);
    context.lineTo(data.to.x, data.to.y);

    context.stroke();
}

/**
 * SERVER OPERATIONS
 */

function readWebsocketMessage(msg) {
    if (msg == null || msg.status == null || msg.eventType == null) {
        console.error('[readWebsocketMessage] recieved invalid websocket message');
        return;
    }
    switch (msg.status) {
        case STATUS.OK:
            break;
        case STATUS.ERROR:
            console.error('[readWebsocketMessage] error occured on the server');
            return;
        default:
            console.error('[readWebsocketMessage] inalid status');
            return;
    }
    switch (msg.eventType) {
        case EVENT_TYPE.DRAW:
            odDraw(msg);
            break;
        case EVENT_TYPE.AUTH:
            onAuth(msg);
            break;
        case EVENT_TYPE.CHAT:
            onChatMessage(msg);
            break;
        case EVENT_TYPE.KEYWORD:
            onKeyword(msg);
            break;
        case EVENT_TYPE.CLEAR:
            onClear();
            break;
        case EVENT_TYPE.RESET:
            onReset();
            break;
        case EVENT_TYPE.WS_OPEN:
            console.error('[readWebsocketMessage] cannot handle event type ' + eventType);
            break;
        case EVENT_TYPE.WS_CLOSE:
            console.error('[readWebsocketMessage] cannot handle event type ' + eventType);
            break;
        default:
            console.error('[readWebsocketMessage] invalid event type ' + eventType);
            return;
    }
}

function sendStroke(fromX, fromY, toX, toY) {
    const drawingData = {
        from: {
            x: fromX,
            y: fromY
        },
        to: {
            x: toX,
            y: toY
        }
    };
    prepareWebsocketMessage(STATUS.OK, EVENT_TYPE.DRAW, drawingData);
}

function clearCanvas() {

}