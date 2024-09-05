package com.example.fastboot.common.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.HashMap;

/**
 * @author liuzhaobo
 */
@SpringBootConfiguration
public class SwaggerOpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        Contact contact = new Contact()
                .name("脚手架接口文档")
                .email("")
                .url("")
                .extensions(new HashMap<>());

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0.html")
                .identifier("Apache-2.0")
                .extensions(new HashMap<>());

        Info info = new Info()
                .title("脚手架接口文档")
                .description("随服务端启动，可生成离线文件")
                .version("0.0.1")
                .termsOfService("")
                .license(license)
                .contact(contact);

        return new OpenAPI()
                .openapi("3.0.1")
                .info(info);
    }
}
