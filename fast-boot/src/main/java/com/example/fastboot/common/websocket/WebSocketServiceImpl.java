package com.example.fastboot.common.websocket;


import com.alibaba.fastjson2.JSON;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.redis.RedisCache;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.common.security.service.TokenService;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


/**
 * @author liuzhaobo
 */
@Slf4j
@Component
public class WebSocketServiceImpl implements WebSocketService {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private RedisCache redisCache;
    private final Map<String, WebSocketSession> clients = new ConcurrentHashMap<>();

    //    如果在广播的时候，客户端很多，发送的消息也是很多，还是会出现和之前 第一种方式-原生注解（tomcat内嵌）相同的问题，出现类似如下报错
//    The remote endpoint was in state [xxxx] which is an invalid state for calle
    @Override
    public void handleOpen(WebSocketSession session) {
        // 这个时候就需要在建立 webSocket 时存储的 用户信息了
        LoginUser user = getLoginUser(session);
        clients.put(user.getUserGuid(), session);
        log.info("a new connection opened，current online count：{}", clients.size());

    }

    @Override
    public void handleClose(WebSocketSession session) {
        // 这个时候就需要在建立 webSocket 时存储的 用户信息了
        LoginUser user = getLoginUser(session);
        clients.remove(user.getUserGuid());
        log.info("a new connection closed，current online count：{}", clients.size());
    }

    private LoginUser getLoginUser(WebSocketSession session) {
        String token =tokenService.getWsToken(session);
        Claims claims = tokenService.parseToken(token);
        // 解析对应的权限以及用户信息
        String uuid = (String) claims.get(Constants.LOGIN_USER_KEY);
        String userKey = tokenService.getTokenKey(uuid);
        LoginUser user = JSON.parseObject(redisCache.getCacheObject(userKey).toString(), LoginUser.class);
        return user;
    }

    @Override
    public void handleMessage(WebSocketSession session, String message) {
        // 只处理前端传来的文本消息，并且直接丢弃了客户端传来的消息
        log.info("received a message：{}", message);
    }

    @Override
    public void sendMessage(WebSocketSession session, String message) throws IOException {
        this.sendMessage(session, new TextMessage(message));
    }

    @Override
    public void sendMessage(String userGuid, TextMessage message) throws IOException {
        WebSocketSession webSocketSession = clients.get(userGuid);

        if (webSocketSession != null && webSocketSession.isOpen()) {
            webSocketSession.sendMessage(message);
        }
    }

    @Override
    public void sendMessage(String userGuid, String message) throws IOException {
        this.sendMessage(userGuid, new TextMessage(message));
    }

    @Override
    public void sendMessage(WebSocketSession session, TextMessage message) throws IOException {
        session.sendMessage(message);
    }

    @Override
    public void broadCast(String message) throws IOException {
        clients.values().forEach(session -> {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    @Override
    public void broadCast(TextMessage message) throws IOException {
        clients.values().forEach(session -> {
            if (session.isOpen()) {
                try {
                    session.sendMessage(message);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    @Override
    public void handleError(WebSocketSession session, Throwable error) {
        log.error("websocket error：{}，session id：{}", error.getMessage(), session.getId());
        log.error("", error);
    }

}

