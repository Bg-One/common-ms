package com.example.fastboot.common.aspectj.annotation;

import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.controller.Base;
import com.example.fastboot.server.sys.model.SysRole;
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

    /**
     * 验证用户是否具有以下任意一个权限
     *
     * @param permissions 以 PERMISSION_DELIMETER 为分隔符的权限列表
     * @return 用户是否具有以下任意一个权限
     */
    public boolean hasAnyPermi(String permissions) {
        if (StringUtils.isEmpty(permissions)) {
            return false;
        }
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getPermissions())) {
            return false;
        }
        Set<String> authorities = loginUser.getPermissions();
        for (String permission : permissions.split(",")) {
            return permissions.contains(Constants.ALL_PERMISSION) || authorities.contains(permission);
        }
        return false;
    }

    /**
     * 判断用户是否拥有某个角色
     *
     * @param role 角色字符串
     * @return 用户是否具备某角色
     */
    public boolean hasRole(String role) {
        if (StringUtils.isEmpty(role)) {
            return false;
        }
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        if (loginUser == null || CollectionUtils.isEmpty(loginUser.getUser().getRoles())) {
            return false;
        }
        for (SysRole sysRole : loginUser.getUser().getRoles()) {
            String roleKey = sysRole.getRoleKey();
            if (Constants.SUPER_ADMIN.equals(roleKey) || roleKey.equals(StringUtils.trim(role))) {
                return true;
            }
        }
        return false;
    }

    /**
     * 验证用户是否具有以下任意一个角色
     *
     * @param roles 以 ROLE_NAMES_DELIMETER 为分隔符的角色列表
     * @return 用户是否具有以下任意一个角色
     */
    public boolean hasAnyRoles(String roles) {
        if (StringUtils.isEmpty(roles)) {
            return false;
        }
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        if (loginUser==null || CollectionUtils.isEmpty(loginUser.getUser().getRoles())) {
            return false;
        }
        for (String role : roles.split(",")) {
            if (hasRole(role)) {
                return true;
            }
        }
        return false;
    }
}
