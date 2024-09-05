package com.example.fastboot.common.aspectj.annotation;

import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.controller.Base;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Set;

/**
 * @author liuzhaobo
 */
@Component("permission")
public class CustomerPermission {

    public boolean hasAuthority(String authority) {
        if (StringUtils.isEmpty(authority)) {
            return false;
        }
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        Set<String> permissions = loginUser.getPermissions();
        //判断用户权限集合中是否存在authority
        return permissions.contains(Constants.ALL_PERMISSION) || permissions.contains(authority);
    }
}
