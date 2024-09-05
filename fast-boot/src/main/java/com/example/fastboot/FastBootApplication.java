package com.example.fastboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

/**
 * @author liuzhaobo
 */
@SpringBootApplication
@EnableWebSocket
@EnableAsync
@MapperScan(basePackages = {"com.example.fastboot.server.**.mapper"})
public class FastBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(FastBootApplication.class, args);
    }

}
