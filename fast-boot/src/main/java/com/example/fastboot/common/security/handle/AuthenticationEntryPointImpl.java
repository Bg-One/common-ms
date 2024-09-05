package com.example.fastboot.common.security.handle;

import com.alibaba.fastjson2.JSON;

import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.utils.WebUtils;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证失败处理
 *
 * @author liuzhaobo
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        Map<String, Object> result = new HashMap<>();
        result.put("code", CommonResultEnum.TOKEN_EXPIRED.code);
        result.put("message", "认证失败，无法访问系统资源");
        result.put("data", "用户认证失败");
        WebUtils.renderString(response, JSON.toJSONString(result));
    }
}
