package com.example.fastboot.server.sys.service;

import com.example.fastboot.server.sys.vo.LoginVo;

/**
 * @Author bo
 * @Date 2024 07 24 11 31
 **/
public interface ISysLoginService {

    /**
     * 系统登录
     *
     * @param loginVo 登录用户实体
     * @return 登录成功后返回jwt
     */
    String login(LoginVo loginVo);


}
