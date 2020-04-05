package websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/draw")
public class DrawWS {
 
	private Session session;
	private static Set<DrawWS> endpoints = new CopyOnWriteArraySet<>();
	
	@OnOpen
    public void onOpen(Session session) throws IOException {
		this.session = session;
		endpoints.add(this);
    }
	
    @OnMessage
    public void onMessage(Session session, String message) throws IOException {
//    	System.out.println("session " + session.getId() + ", message: " + message);
    	endpoints.forEach( endpoint -> {
    		synchronized (endpoint) {
				try {
					endpoint.session.getBasicRemote().sendText(message);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
    	});
    }
    
    @OnClose
	public void onClose(Session session) {
    	endpoints.remove(this);
	}

}
