package com.example.fastboot.common.config;

import com.example.fastboot.common.constant.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * @Author bo
 * @Date 2024 08 14 10 13
 **/
@Configuration
public class ResourceConfig implements WebMvcConfigurer {
    @Autowired
    private FastCommonConfig fastCommonConfig;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        /** 本地文件上传路径 */
        registry.addResourceHandler(Constants.RESOURCE_PREFIX + "/**")
                .addResourceLocations("file:" + fastCommonConfig.getProfile() + "/");

    }
}
