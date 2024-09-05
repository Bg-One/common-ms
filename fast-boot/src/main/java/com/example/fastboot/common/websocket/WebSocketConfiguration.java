package com.example.fastboot.common.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


/**
 * @author liuzhaobo
 */
@Configuration
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Autowired
    private DefaultWebSocketHandler defaultWebSocketHandler;



    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 链接方式如下 ws://127.0.0.1:1111/${项目名}/websocket/globalWs
        registry.addHandler(defaultWebSocketHandler, "websocket/globalWs")
                .setAllowedOrigins("*");
    }
}

