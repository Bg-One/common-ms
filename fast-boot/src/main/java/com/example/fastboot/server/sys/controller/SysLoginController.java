package com.example.fastboot.server.sys.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.common.security.service.SysPermissionService;
import com.example.fastboot.common.security.service.TokenService;
import com.example.fastboot.common.utils.WebUtils;
import com.example.fastboot.server.sys.model.SysMenu;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysLoginService;
import com.example.fastboot.server.sys.service.ISysMenuService;
import com.example.fastboot.server.sys.vo.LoginVo;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author liuzhaobo
 */
@RestController()
@RequestMapping(value = "/sys")
@Validated
public class SysLoginController {

    @Autowired
    public ISysLoginService iSysLoginService;

    @Autowired
    private ISysMenuService iSysMenuService;
    @Autowired
    private SysPermissionService permissionService;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public Object login(@ParameterObject LoginVo loginVo) {
        // 生成令牌
        String token = iSysLoginService.login(loginVo);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("access_token", token);
        return CommonResult.success(jsonObject);
    }

    @PostMapping("/logout")
    public Object login(HttpServletRequest request) {
        LoginUser loginUser = tokenService.getLoginUser(request);
        if (loginUser != null) {
            String userName = loginUser.getUsername();
            // 删除用户缓存记录
            tokenService.delLoginUser(loginUser.getToken());
            // 记录用户退出日志
            iSysLoginService.insertLoginInfo(userName, "用户退出成功", Constants.LOGIN_FAIL);
        }
        return CommonResult.success();
    }

    /**
     * 获取用户信息
     *
     * @return 用户信息
     */
    @PostMapping("/getUserInfo")
    public Object getInfo() {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        SysUser user = loginUser.getUser();
        // 角色集合
        Set<String> roles = permissionService.getRolePermission(user);
        // 权限集合
        Set<String> permissions = permissionService.getMenuPermission(user);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("user", user);
        jsonObject.put("roles", roles);
        jsonObject.put("permissions", permissions);
        return CommonResult.success(jsonObject);
    }

    /**
     * 获取路由信息
     *
     * @return 路由信息
     */
    @PostMapping("getRouters")
    public Object getRouters() {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        String userGuid = loginUser.getUserGuid();
        List<SysMenu> menus = iSysMenuService.selectMenuTreeByUserGuid(userGuid);
        return CommonResult.success(menus);
    }
}
