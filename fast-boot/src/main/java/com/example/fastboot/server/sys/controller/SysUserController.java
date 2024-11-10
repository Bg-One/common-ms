package com.example.fastboot.server.sys.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 07 29 20 24
 **/
@RestController
@RequestMapping("/user")
public class SysUserController {
    @Autowired
    private ISysUserService iSysUserService;


    /**
     * 获取用户列表
     */
    @PostMapping("/listUser")
    public Object listUser(SysUser user) {
        List<SysUser> list = iSysUserService.selectUserList(user);
        return CommonResult.success(list);
    }


    /**
     * 根据单位获取用户列表
     */
    @PostMapping("/listUserByDept")
    public Object listUserByDept(String deptGuid) {
        List<SysUser> list = iSysUserService.listUserByDept(deptGuid);
        return CommonResult.success(list);
    }
    /**
     * 新增用户
     */
    @SysLog(title = "用户管理", businessType = BusinessType.INSERT)
    @PostMapping("/addUser")
    public Object addUser(SysUser user) {
        user.setUserGuid(UUID.randomUUID().toString());
        if (!iSysUserService.checkUserNameUnique(user)) {
            throw new ServiceException(CommonResultEnum.USER_EXIT_DISABLE);
        } else if (StringUtils.isNotEmpty(user.getPhonenumber()) && !iSysUserService.checkPhoneUnique(user)) {
            throw new ServiceException(CommonResultEnum.PHONE_EXIT_DISABLE);
        } else if (StringUtils.isNotEmpty(user.getEmail()) && !iSysUserService.checkEmailUnique(user)) {
            throw new ServiceException(CommonResultEnum.EMAIL_EXIT_DISABLE);
        }
        user.setCreateBy(Base.getCreatUserName());
        iSysUserService.insertUser(user);
        return CommonResult.success();
    }

    /**
     * 修改用户
     */
    @SysLog(title = "用户管理", businessType = BusinessType.UPDATE)
    @PostMapping("/editUser")
    public Object editUser(SysUser sysUser) {
        if (sysUser.getUserName().equals("admin")) {
            throw new ServiceException(CommonResultEnum.ADMIN_EDIT_DISABLE);
        } else if (!iSysUserService.checkUserNameUnique(sysUser)) {
            throw new ServiceException(CommonResultEnum.USER_EXIT_DISABLE);
        } else if (StringUtils.isNotEmpty(sysUser.getPhonenumber()) && !iSysUserService.checkPhoneUnique(sysUser)) {
            throw new ServiceException(CommonResultEnum.PHONE_EXIT_DISABLE);
        } else if (StringUtils.isNotEmpty(sysUser.getEmail()) && !iSysUserService.checkEmailUnique(sysUser)) {
            throw new ServiceException(CommonResultEnum.EMAIL_EXIT_DISABLE);
        }
        sysUser.setUpdateBy(Base.getCreatUserName());
        iSysUserService.updateUser(sysUser);
        return CommonResult.success();
    }

    /**
     * 删除用户
     */
    @SysLog(title = "用户管理", businessType = BusinessType.DELETE)
    @PostMapping("/deleteUser")
    public Object deleteUser(SysUser sysUser) {
        LoginUser creatUserDetails = (LoginUser) Base.getCreatUserDetails();
        SysUser user = creatUserDetails.getUser();
        if (user.getUserGuid().equals(sysUser.getUserGuid())) {
            throw new ServiceException(CommonResultEnum.USER_DELE_DISABLE);
        } else if (SysUser.isAdmin(sysUser.getUserGuid())) {
            throw new ServiceException(CommonResultEnum.ADMIN_EDIT_DISABLE);
        }
        iSysUserService.deleteUserByGuid(sysUser.getUserGuid());
        return CommonResult.success();
    }

    /**
     * 重置密码
     */
    @SysLog(title = "用户管理", businessType = BusinessType.UPDATE)
    @PostMapping("/resetPwd")
    public Object resetPwd(SysUser sysUser) {
        if (SysUser.isAdmin(sysUser.getUserGuid())) {
            throw new ServiceException(CommonResultEnum.ADMIN_EDIT_DISABLE);
        }
        iSysUserService.resetPwd(sysUser);
        return CommonResult.success();
    }

    /**
     * 状态修改
     */
    @SysLog(title = "用户管理", businessType = BusinessType.UPDATE)
    @PostMapping("/changeStatus")
    public Object changeStatus(SysUser sysUser) {
        if (SysUser.isAdmin(sysUser.getUserGuid())) {
            throw new ServiceException(CommonResultEnum.ADMIN_EDIT_DISABLE);
        }
        sysUser.setUpdateBy(Base.getCreatUserName());
        iSysUserService.updateUserStatus(sysUser);
        return CommonResult.success();
    }

}
