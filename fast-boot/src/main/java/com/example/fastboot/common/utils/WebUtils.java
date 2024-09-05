package com.example.fastboot.common.utils;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author liuzhaobo
 */
@Slf4j
public class WebUtils {
    public static void renderString(HttpServletResponse response, String data) {
        try {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(data);
        } catch (IOException e) {
            log.error("renderString", e);
        }
    }
}
