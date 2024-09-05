package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.common.response.TreeSelect;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.mapper.SysMenuMapper;
import com.example.fastboot.server.sys.mapper.SysRoleMapper;
import com.example.fastboot.server.sys.model.SysMenu;
import com.example.fastboot.server.sys.model.SysRole;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysMenuService;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


/**
 * @author liuzhaobo
 */
@Service
public class SysMenuServiceImpl implements ISysMenuService {

    @Autowired
    private SysMenuMapper sysMenuMapper;
    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Override
    public Set<String> selectMenuPermsByRoleGuid(String roleGuid) {
        List<String> perms = sysMenuMapper.selectMenuPermsByRoleGuid(roleGuid);
        Set<String> permsSet = new HashSet<>();
        for (String perm : perms) {
            if (StringUtils.isNotEmpty(perm)) {
                permsSet.addAll(Arrays.asList(perm.trim().split(",")));
            }
        }
        return permsSet;
    }

    @Override
    public Set<String> selectMenuPermsByUserId(String userGuid) {
        List<String> perms = sysMenuMapper.selectMenuPermsByUserId(userGuid);
        Set<String> permsSet = new HashSet<>();
        for (String perm : perms) {
            if (StringUtils.isNotEmpty(perm)) {
                permsSet.addAll(Arrays.asList(perm.trim().split(",")));
            }
        }
        return permsSet;
    }

    @Override
    public List<SysMenu> selectMenuList(SysMenu sysMenu, LoginUser loginUser) {
        String userGuid = loginUser.getUserGuid();
        List<SysMenu> menuList = null;
        // 管理员显示所有菜单信息
        if (SysUser.isAdmin(userGuid)) {
            menuList = sysMenuMapper.selectMenuList(sysMenu);
        } else {
            menuList = sysMenuMapper.selectMenuListByUserGuid(sysMenu, userGuid);
        }
        return menuList;
    }

    @Override
    public boolean hasChildByMenuGuid(String menuGuid) {
        int result = sysMenuMapper.hasChildByMenuGuid(menuGuid);
        return result > 0;
    }

    @Override
    public boolean checkMenuNameUnique(SysMenu menu) {
        SysMenu sysMenu = sysMenuMapper.checkMenuNameUnique(menu.getMenuName(), menu.getMenuGuid(), menu.getParentGuid());
        return sysMenu == null;
    }

    @Override
    public void insertMenu(SysMenu menu) {
        sysMenuMapper.insetMenu(menu);
    }

    @Override
    public void updateMenu(SysMenu menu) {
        sysMenuMapper.updateMenu(menu);
    }

    @Override
    public List<TreeSelect> buildMenuTreeSelect(List<SysMenu> menus) {
        List<SysMenu> menuTrees = buildMenuTree(menus);
        return menuTrees.stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    @Override
    public List<String> selectMenuListByRoleId(String roleGuid) {
        SysRole role = sysRoleMapper.selectRoleGuid(roleGuid);
        return sysMenuMapper.selectMenuListByRoleGuid(roleGuid, role.isMenuCheckStrictly());
    }

    @Override
    public boolean checkMenuExistRole(String menuGuid) {
        int result = sysMenuMapper.checkMenuExistRole(menuGuid);
        return result > 0;
    }

    @Override
    public void deleteMenuByGuid(String menuGuid) {
        sysMenuMapper.deleteMenuByGuid(menuGuid);
    }

    /**
     * 构建前端所需要树结构
     *
     * @param menus 菜单列表
     * @return 树结构列表
     */
    @Override
    public List<SysMenu> buildMenuTree(List<SysMenu> menus) {
        List<SysMenu> returnList = new ArrayList<SysMenu>();
        List<String> tempList = menus.stream().map(SysMenu::getMenuGuid).collect(Collectors.toList());
        for (Iterator<SysMenu> iterator = menus.iterator(); iterator.hasNext(); ) {
            SysMenu menu = (SysMenu) iterator.next();
            // 如果是顶级节点, 遍历该父节点的所有子节点
            if (!tempList.contains(menu.getParentGuid())) {
                recursionFn(menus, menu);
                returnList.add(menu);
            }
        }
        if (returnList.isEmpty()) {
            returnList = menus;
        }
        return returnList;
    }

    @Override
    public List<SysMenu> selectMenuTreeByUserGuid(String userGuid) {
        List<SysMenu> menus = null;
        if (SysUser.isAdmin(userGuid)) {
            menus = sysMenuMapper.selectMenuTreeAll();
        } else {
            menus = sysMenuMapper.selectMenuTreeByUserGuid(userGuid);
        }
        return getChildPerms(menus, "");
    }


    /**
     * 递归列表
     *
     * @param list 分类表
     * @param t    子节点
     */
    private void recursionFn(List<SysMenu> list, SysMenu t) {
        // 得到子节点列表
        List<SysMenu> childList = getChildList(list, t);
        t.setChildren(childList);
        for (SysMenu tChild : childList) {
            if (hasChild(list, tChild)) {
                recursionFn(list, tChild);
            }
        }
    }

    /**
     * 得到子节点列表
     */
    private List<SysMenu> getChildList(List<SysMenu> list, SysMenu t) {
        List<SysMenu> tlist = new ArrayList<SysMenu>();
        Iterator<SysMenu> it = list.iterator();
        while (it.hasNext()) {
            SysMenu n = (SysMenu) it.next();
            if (n.getParentGuid().equals(t.getMenuGuid())) {
                tlist.add(n);
            }
        }
        return tlist;
    }

    /**
     * 判断是否有子节点
     */
    private boolean hasChild(List<SysMenu> list, SysMenu t) {
        return getChildList(list, t).size() > 0;
    }

    /**
     * 根据父节点的ID获取所有子节点
     *
     * @param list       分类表
     * @param parentGuid 传入的父节点ID
     * @return String
     */
    public List<SysMenu> getChildPerms(List<SysMenu> list, String parentGuid) {
        List<SysMenu> returnList = new ArrayList<SysMenu>();
        for (Iterator<SysMenu> iterator = list.iterator(); iterator.hasNext(); ) {
            SysMenu t = (SysMenu) iterator.next();
            // 一、根据传入的某个父节点ID,遍历该父节点的所有子节点
            if (t.getParentGuid().equals(parentGuid)) {
                recursionFn(list, t);
                returnList.add(t);
            }
        }
        return returnList;
    }
}
