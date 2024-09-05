package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.server.sys.mapper.SysRoleMapper;
import com.example.fastboot.server.sys.model.SysRole;
import com.example.fastboot.server.sys.model.SysRoleMenu;
import com.example.fastboot.server.sys.model.SysUserRole;
import com.example.fastboot.server.sys.service.ISysRoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


/**
 * @author liuzhaobo
 */
@Service
public class SysRoleServiceImpl implements ISysRoleService {

    @Autowired
    private SysRoleMapper sysRoleMapper;


    @Override
    public Set<String> selectRolePermissionByUserId(String userGuid) {
        List<SysRole> perms = sysRoleMapper.selectRolePermissionByUserId(userGuid);
        Set<String> permsSet = new HashSet<>();
        for (SysRole perm : perms) {
            if (!Objects.isNull(perm)) {
                permsSet.addAll(Arrays.asList(perm.getRoleKey().trim().split(",")));
            }
        }
        return permsSet;
    }

    @Override
    public List<SysRole> selectRoleList(SysRole role) {
        return sysRoleMapper.selectRoleList(role);

    }

    @Override
    @Transactional
    public void deleteRoleByRoleGuid(String roleGuid) {
        // 删除角色与菜单关联
        sysRoleMapper.deleteRoleMenu(roleGuid);
        sysRoleMapper.deleteRoleByRoleGuid(roleGuid);
    }

    @Override
    public int countUserRoleByRoleGuid(String roleGuid) {
        return sysRoleMapper.countUserRoleByRoleGuid(roleGuid);
    }

    @Override
    public void deleteAuthUsers(String roleGuid, String[] userGuids) {
        sysRoleMapper.deleteUserRoleInfos(roleGuid, userGuids);
    }

    @Override
    public void insertAuthUsers(String roleGuid, String[] userGuids) {
        // 新增用户与角色管理
        List<SysUserRole> list = new ArrayList<SysUserRole>();
        for (String userGuid : userGuids) {
            SysUserRole ur = new SysUserRole();
            ur.setUserGuid(userGuid);
            ur.setRoleGuid(roleGuid);
            list.add(ur);
        }
        sysRoleMapper.batchUserRole(list);
    }

    @Override
    public boolean checkRoleNameUnique(SysRole role) {
        SysRole sysRole = sysRoleMapper.checkRoleNameUnique(role);
        return sysRole == null;
    }

    @Override
    public boolean checkRoleKeyUnique(SysRole role) {
        SysRole sysRole = sysRoleMapper.checkRoleKeyUnique(role);
        return sysRole == null;
    }

    @Override
    @Transactional
    public void insertRole(SysRole role) {
        // 新增角色信息
        sysRoleMapper.insertRole(role);
        insertRoleMenu(role);
    }

    /**
     * 新增角色菜单信息
     *
     * @param role 角色对象
     */
    public int insertRoleMenu(SysRole role) {
        int rows = 0;
        // 新增用户与角色管理
        List<SysRoleMenu> list = new ArrayList<SysRoleMenu>();
        for (String menuGuid : role.getMenuGuids()) {
            SysRoleMenu rm = new SysRoleMenu();
            rm.setRoleGuid(role.getRoleGuid());
            rm.setMenuGuid(menuGuid);
            list.add(rm);
        }
        if (list.size() > 0) {
            rows = sysRoleMapper.batchRoleMenu(list);
        }
        return rows;
    }

    @Override
    public int updateRole(SysRole role) {
        // 修改角色信息
        sysRoleMapper.updateRole(role);
        // 删除角色与菜单关联
        sysRoleMapper.deleteRoleMenuByRoleGuid(role.getRoleGuid());
        return insertRoleMenu(role);
    }
}
