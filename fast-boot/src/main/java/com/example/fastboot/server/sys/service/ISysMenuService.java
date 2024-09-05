package com.example.fastboot.server.sys.service;


import com.example.fastboot.common.response.TreeSelect;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.model.SysMenu;

import java.util.List;
import java.util.Set;

/**
 * @author liuzhaobo
 */
public interface ISysMenuService {

    /**
     * 根据角色ID查询权限
     *
     * @param roleGuid 角色唯一标识
     * @return 权限列表
     */
    Set<String> selectMenuPermsByRoleGuid(String roleGuid);

    /**
     * 根据用户ID查询权限
     *
     * @param userGuid 用户唯一标识
     * @return 权限列表
     */
    Set<String> selectMenuPermsByUserId(String userGuid);

    /**
     * 查询系统菜单列表
     *
     * @param sysMenu   系统菜单对象
     * @param loginUser 登录用户
     * @return
     */
    List<SysMenu> selectMenuList(SysMenu sysMenu, LoginUser loginUser);


    /**
     * 是否已经分配角色
     *
     * @param menuGuid 菜单唯一标识
     * @return 是否已经分配角色
     */
    boolean checkMenuExistRole(String menuGuid);

    /**
     * 根据菜单唯一标识删除菜单/权限
     *
     * @param menuGuid 菜单唯一标识
     */
    void deleteMenuByGuid(String menuGuid);

    /**
     * 是否存在子菜单
     *
     * @param menuGuid 菜单唯一标识
     * @return 是否粗在子菜单
     */
    boolean hasChildByMenuGuid(String menuGuid);

    /**
     * 菜单名是否唯一
     *
     * @param menu
     * @return
     */
    boolean checkMenuNameUnique(SysMenu menu);

    /**
     * 新增权限/菜单
     *
     * @param menu 菜单信息
     */
    void insertMenu(SysMenu menu);

    /**
     * 菜单/权限更新
     *
     * @param menu
     */
    void updateMenu(SysMenu menu);


    List<TreeSelect> buildMenuTreeSelect(List<SysMenu> menus);

    List<String> selectMenuListByRoleId(String roleGuid);

    /**
     * 构建前端所需要树结构
     *
     * @param menus 菜单列表
     * @return 树结构列表
     */
    public List<SysMenu> buildMenuTree(List<SysMenu> menus);

    /**
     * 根据用户唯一标识获取菜单
     *
     * @param userGuid 用户唯一标识
     * @return 菜单
     */
    List<SysMenu> selectMenuTreeByUserGuid(String userGuid);

}
