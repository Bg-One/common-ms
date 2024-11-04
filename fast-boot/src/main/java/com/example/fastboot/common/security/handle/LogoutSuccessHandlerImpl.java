package com.example.fastboot.common.security.handle;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.common.security.service.TokenService;
import com.example.fastboot.common.utils.WebUtils;
import com.example.fastboot.server.sys.service.ISysLoginService;
import com.example.fastboot.server.sys.service.ISysLogininforService;
import com.example.fastboot.server.sys.service.impl.SysLoginServiceImpl;
import liquibase.pro.packaged.A;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * @author liuzhaobo
 */
@Configuration
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler {
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ISysLoginService sysLoginService;
    /**
     * 退出处理
     *
     * @return
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        LoginUser loginUser = tokenService.getLoginUser(request);
        if (null != loginUser) {
            String userName = loginUser.getUsername();
            // 删除用户缓存记录
            tokenService.delLoginUser(loginUser.getToken());
            // 记录用户退出日志
            sysLoginService.insertLoginInfo(userName, "用户退出成功", Constants.LOGOUT); ;
        }
        JSONObject result = new JSONObject();
        result.put("code", CommonResultEnum.SUCCESS.code);
        result.put("message", "退出成功");
        WebUtils.renderString(response, JSON.toJSONString(result));
    }
}
