package websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;

import java.util.Set;

import javax.json.Json;

import javax.json.JsonObjectBuilder;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/serverendpointdemo")
public class WebsocketDemo extends RandomWord {
	static Set<Session> chatroomUsers = Collections.synchronizedSet(new HashSet<Session>());
	String ran;
	String username;
	@OnOpen
	public void handleOpen(Session userSession) throws IOException {

		chatroomUsers.add(userSession);
		ran = randomizer();
	}

	@OnMessage
	public void handleMessage(String message, Session userSession) throws Exception {
		Iterator<Session> iterator = chatroomUsers.iterator();
		username = (String) userSession.getUserProperties().get("username");
		
		if (username == null && !message.contains("next")) {
			String type = "abc";
			userSession.getUserProperties().put("username", message);
			userSession.getBasicRemote().sendText(buildJsonData("System", "nowy uzytkownik: " + message, type, ran));

		} else if (!message.equals(ran) && !message.contains("next")) {

			String type = "ANSWER";

			while (iterator.hasNext())
				iterator.next().getBasicRemote().sendText(buildJsonData(username, message, type, ran));
		}  else if (message.contains("next")) {
			String type = "WORD";
			ran = randomizer();
			while (iterator.hasNext())

				iterator.next().getBasicRemote().sendText(buildJsonData("System", "Nowe has³o!", type, ran));
		}
		if (message.equals(ran)) {
			String type = "WORD";
			ran = randomizer();
			while (iterator.hasNext())

				iterator.next().getBasicRemote()
						.sendText(buildJsonData("System", "Brawo! chodzi³o o " + message, type, ran));
		}
	}
	private String buildJsonData(String username, String message, String type, String txt) {
		JsonObjectBuilder jsonObject = Json.createObjectBuilder();
		jsonObject.add("message", username + ": " + message);
		jsonObject.add("type", type);
		jsonObject.add("txt", txt);

		return jsonObject.build().toString();

	}

	@OnClose
	public void handleClose(Session userSession) {
		chatroomUsers.remove(userSession);

	}

	@OnError
	public void handleError(Throwable t) {
		t.printStackTrace();
	}

}
