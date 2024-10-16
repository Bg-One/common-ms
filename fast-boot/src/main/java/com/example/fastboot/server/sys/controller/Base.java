package com.example.fastboot.server.sys.controller;

import com.example.fastboot.common.security.LoginUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * @Author bo
 * @Date 2024 07 27 16 26
 **/
public class Base {

    public static String getCreatUserName() {
        LoginUser loginUser = (LoginUser) getCreatUserDetails();
        return loginUser.getUsername();
    }

    public static String getCreatUserGuid() {
        LoginUser loginUser = (LoginUser) getCreatUserDetails();
        return loginUser.getUserGuid();
    }

    public static UserDetails getCreatUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetails) authentication.getPrincipal();
    }
}
