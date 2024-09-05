package com.example.fastboot.server.sys.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.common.security.service.SysPermissionService;
import com.example.fastboot.common.security.service.TokenService;
import com.example.fastboot.server.sys.model.SysRole;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysRoleService;
import com.example.fastboot.server.sys.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 07 30 16 06
 **/
@RestController
@RequestMapping("/role")
public class SysRoleController {

    @Autowired
    private ISysRoleService iSysRoleService;
    @Autowired
    private ISysUserService iSysUserService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ISysUserService iUserService;
    @Autowired
    private SysPermissionService sysPermissionService;

    @PreAuthorize("@permission.hasAuthority('system:role:list')")
    @PostMapping("/listRole")
    public Object list(SysRole role) {
        List<SysRole> list = iSysRoleService.selectRoleList(role);
        return success(list);
    }

    /**
     * 新增角色
     */
    @PreAuthorize("@permission.hasAuthority('system:role:add')")
    @SysLog(title = "角色管理", businessType = BusinessType.INSERT)
    @PostMapping("/addRole")
    public Object addRole(SysRole role) {
        role.setRoleGuid(UUID.randomUUID().toString());
        if (!iSysRoleService.checkRoleNameUnique(role)) {
            throw new ServiceException(CommonResultEnum.ROLE_EXIT_DISABLE);
        } else if (!iSysRoleService.checkRoleKeyUnique(role)) {
            throw new ServiceException(CommonResultEnum.ROLE_KEY_DISABLE);
        }
        role.setCreateBy(Base.getCreatUserName());
        iSysRoleService.insertRole(role);
        return success();
    }

    /**
     * 修改保存角色
     */
    @PreAuthorize("@permission.hasAuthority('system:role:edit')")
    @SysLog(title = "角色管理", businessType = BusinessType.UPDATE)
    @PostMapping("/editRole")
    public Object editRole(SysRole role) {

        if (!iSysRoleService.checkRoleNameUnique(role)) {
            throw new ServiceException(CommonResultEnum.ROLE_EXIT_DISABLE);
        } else if (!iSysRoleService.checkRoleKeyUnique(role)) {
            throw new ServiceException(CommonResultEnum.ROLE_KEY_DISABLE);
        } else if (role.getRoleName().equals("超级管理员")) {
            throw new ServiceException(CommonResultEnum.SUPERROLE_EDIT_DISABLE);
        }
        role.setUpdateBy(Base.getCreatUserName());
        if (iSysRoleService.updateRole(role) > 0) {
            // 更新缓存用户权限
            LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
            if (loginUser.getUser() != null && !loginUser.getUser().isAdmin()) {
                loginUser.setPermissions(sysPermissionService.getMenuPermission(loginUser.getUser()));
                loginUser.setUser(iUserService.selectUserByUserName(loginUser.getUser().getUserName()));
                tokenService.setLoginUser(loginUser);
            }
        }
        return success();
    }

    /**
     * 删除角色
     */
    @PreAuthorize("@permission.hasAuthority('system:role:remove')")
    @SysLog(title = "角色管理", businessType = BusinessType.DELETE)
    @PostMapping("/deleteRole")
    public Object remove(SysRole sysRole) {
        String roleGuid = sysRole.getRoleGuid();
        if (iSysRoleService.countUserRoleByRoleGuid(roleGuid) > 0) {
            throw new ServiceException(CommonResultEnum.ROLE_USER_EXIT_DELE_DISABLE);
        } else if (sysRole.getRoleName().equals("超级管理员")) {
            throw new ServiceException(CommonResultEnum.SUPERROLE_DELETE_DISABLE);
        }
        iSysRoleService.deleteRoleByRoleGuid(roleGuid);
        return success();
    }

    /**
     * 查询已分配/未分配用户角色列表
     */
    @PreAuthorize("@permission.hasAuthority('system:role:list')")
    @PostMapping("/allocatedList")
    public Object allocatedList(SysUser sysUser) {
        JSONObject jsonObject = new JSONObject();
        List<SysUser> sysUserList = null;
        if (sysUser.getBindFlag() == 1) {
            sysUserList = iSysUserService.selectAllocatedList(sysUser);
        } else {
            sysUserList = iSysUserService.selectUnallocatedList(sysUser);
        }
        jsonObject.put("sysUserList", sysUserList);
        jsonObject.put("bindFlag", sysUser.getBindFlag());
        return success(jsonObject);
    }

    /**
     * 取消授权用户
     */
    @PreAuthorize("@permission.hasAuthority('system:role:edit')")
    @SysLog(title = "角色管理", businessType = BusinessType.GRANT)
    @PostMapping("/cancelCuthUser")
    public Object cancelCuthUser(String roleGuid, String[] userGuids) {
        iSysRoleService.deleteAuthUsers(roleGuid, userGuids);
        return success();
    }

    /**
     * 用户授权
     */
    @PreAuthorize("@permission.hasAuthority('system:role:edit')")
    @SysLog(title = "角色管理", businessType = BusinessType.GRANT)
    @PostMapping("/authUser")
    public Object authUser(String roleGuid, String[] userGuids) {
        iSysRoleService.insertAuthUsers(roleGuid, userGuids);
        return success();
    }
}
