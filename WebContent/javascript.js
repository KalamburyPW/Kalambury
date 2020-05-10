var websocket = new WebSocket(
		"ws://localhost:8080/Kalambury/serverendpointdemo");
websocket.onmessage = function rocessMessage(message) {
	var jsonData = JSON.parse(message.data);
	var word = "WORD";
	var word2 = "abc";
	var w = jsonData.type;
	
	if ((jsonData.txt&&text) == null){
		text = "Zaczynamy?";
	}
	else{
	text = jsonData.txt;
	}
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
	sendMessageNull();
}

function sendMessage() {
	websocket.send(messageText.value);
	messageText.value = "";
}
function sendMessageNull() {
	websocket.send("*Zmienił hasło*");
	
}