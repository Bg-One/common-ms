package com.example.fastboot.server.sys.controller;

import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.model.SysMenu;
import com.example.fastboot.server.sys.service.ISysMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


/**
 * @Author bo
 * @Date 2024 08 01 08 55
 **/
@RestController
@RequestMapping("/menu")
public class SysMenuController {

    @Autowired
    private ISysMenuService iSysMenuService;

    @PreAuthorize("@permission.hasAuthority('system:role:list')")
    @PostMapping("/listMenu")
    public Object list(SysMenu sysMenu) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        List<SysMenu> list = iSysMenuService.selectMenuList(sysMenu, loginUser);
        return CommonResult.success(list);
    }

    /**
     * 删除菜单
     */
    @PreAuthorize("@permission.hasAuthority('system:menu:remove')")
    @SysLog(title = "菜单管理", businessType = BusinessType.DELETE)
    @PostMapping("/deleteSysMenu")
    public Object deleteSysMenu(String menuGuid) {
        if (iSysMenuService.hasChildByMenuGuid(menuGuid)) {
            throw new ServiceException(CommonResultEnum.EXIST_CHILD_DISABLE);
        }
        if (iSysMenuService.checkMenuExistRole(menuGuid)) {
            throw new ServiceException(CommonResultEnum.MENU_ROLE_EXIT_DELE_DISABLE);
        }
        iSysMenuService.deleteMenuByGuid(menuGuid);
        return CommonResult.success();
    }

    /**
     * 新增菜单
     */
    @PreAuthorize("@permission.hasAuthority('system:menu:add')")
    @SysLog(title = "菜单管理", businessType = BusinessType.INSERT)
    @PostMapping("/addMenu")
    public Object addMenu(SysMenu menu) {
        menu.setMenuGuid(UUID.randomUUID().toString());
        if (!iSysMenuService.checkMenuNameUnique(menu)) {
            throw new ServiceException(CommonResultEnum.MENU_NAME_DISABLE);
        }
        menu.setCreateBy(Base.getCreatUserName());
        iSysMenuService.insertMenu(menu);
        return CommonResult.success();
    }

    /**
     * 修改菜单
     */
    @PreAuthorize("@permission.hasAuthority('system:menu:edit')")
    @SysLog(title = "菜单管理", businessType = BusinessType.UPDATE)
    @PostMapping("/editMenu")
    public Object editMenu(SysMenu menu) {
        if (!iSysMenuService.checkMenuNameUnique(menu)) {
            throw new ServiceException(CommonResultEnum.MENU_NAME_DISABLE);
        } else if (menu.getMenuGuid().equals(menu.getParentGuid())) {
            throw new ServiceException(CommonResultEnum.MENU_PARENT_DISABLE);
        }
        menu.setUpdateBy(Base.getCreatUserName());
        iSysMenuService.updateMenu(menu);
        return CommonResult.success();
    }

    /**
     * 加载对应角色菜单列表树
     */
    @PostMapping(value = "/roleMenuTreeselect")
    public Object roleMenuTreeselect(String roleGuid) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        List<SysMenu> menus = iSysMenuService.selectMenuList(new SysMenu(), loginUser);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("menus", iSysMenuService.buildMenuTreeSelect(menus));
        jsonObject.put("checkedKeys", iSysMenuService.selectMenuListByRoleId(roleGuid));
        return CommonResult.success(jsonObject);
    }
}
