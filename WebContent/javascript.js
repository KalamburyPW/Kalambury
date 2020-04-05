var websocket = new WebSocket(
		"ws://localhost:8080/websocket/serverendpointdemo");
websocket.onmessage = function rocessMessage(message) {
	var jsonData = JSON.parse(message.data);
	var word = "WORD";
	var word2 = "abc";
	var w = jsonData.type;
	var text = jsonData.txt;
	var mta = document.getElementById("messagesTextArea");

	if (jsonData.message != null) {

		messagesTextArea.value += jsonData.message + "\n";

		setInterval(mta.scrollTop = mta.scrollHeight);

	}
	if (w.localeCompare(word) || w.localeCompare(word2) === 0) {
		randomText.value = text;

	}

}

function nextText() {
	websocket.send("next");
}

function sendMessage() {
	websocket.send(messageText.value);
	messageText.value = "";
}
