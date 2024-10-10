package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.server.sys.controller.Base;
import com.example.fastboot.server.sys.mapper.SysRoleMapper;
import com.example.fastboot.server.sys.mapper.SysUserMapper;
import com.example.fastboot.server.sys.model.*;
import com.example.fastboot.server.sys.service.ISysUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


/**
 * @author liuzhaobo
 */
@Service
public class SysUserServiceImpl implements ISysUserService {

    @Autowired
    private SysUserMapper sysUserMapper;
    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Override
    public void updateUserProfile(SysUser sysUser) {
        sysUserMapper.updateUser(sysUser);
    }

    @Override
    public SysUser selectUserByUserName(String userName) {
        return sysUserMapper.selectUserByUserName(userName);
    }

    @Override
    public List<SysUser> selectUserList(SysUser user) {
        List<SysUser> sysUsers = sysUserMapper.selectUserList(user);
        if (sysUsers != null && sysUsers.size() > 0) {
            for (SysUser sysUser : sysUsers) {
                List<SysRole> roles = sysUser.getRoles();
                if (roles.size() == 0) {
                    continue;
                }
                String[] roleGuids = new String[roles.size()];
                for (int i = 0; i < roles.size(); i++) {
                    SysRole role = roles.get(i);
                    roleGuids[i] = role.getRoleGuid();
                }
                sysUser.setRoleGuids(roleGuids);

                List<SysPost> posts = sysUser.getPosts();
                String[] postGuids = new String[roles.size()];
                String[] postNames = new String[roles.size()];
                for (int i = 0; i < posts.size(); i++) {
                    SysPost post = posts.get(i);
                    postGuids[i] = post.getPostGuid();
                    postNames[i] = post.getPostName();
                }
                sysUser.setRoleGuids(roleGuids);
                sysUser.setPostNames(postNames);
            }
        }
        return sysUsers;
    }

    @Override
    @Transactional
    public void deleteUserByGuid(String userGuid) {
        // 删除用户与角色关联
        sysRoleMapper.deleteUserRole(userGuid);
        sysUserMapper.deleteUserByUserGuid(userGuid);
    }

    @Override
    public SysUser getSysUserByUserGuid(String userGuid) {
        return sysUserMapper.getSysUserByUserGuid(userGuid);
    }

    @Override
    @Transactional
    public void updateUser(SysUser sysUser) {
        String userGuid = sysUser.getUserGuid();
        // 删除用户与角色关联
        sysRoleMapper.deleteUserRole(userGuid);
        // 新增用户与角色管理
        insertUserRole(sysUser);
        // 删除用户与岗位关联
        sysUserMapper.deleteUserPostByUserGuid(userGuid);
        // 新增用户与岗位管理
        insertUserPost(sysUser);

        sysUserMapper.updateUser(sysUser);
    }

    @Override
    public void resetPwd(SysUser sysUser) {
        sysUser.setPassword(sysUser.getPassword());
        sysUser.setUpdateBy(Base.getCreatUserName());
        sysUserMapper.updateUser(sysUser);
    }

    @Override
    public void updateUserStatus(SysUser sysUser) {
        sysUserMapper.updateUser(sysUser);
    }

    /**
     * 新增用户角色信息
     *
     * @param user 用户对象
     */
    public void insertUserRole(SysUser user) {
        this.insertUserRole(user.getUserGuid(), user.getRoleGuids());
    }

    /**
     * 新增用户角色信息
     *
     * @param userGuid  用户组
     * @param roleGuids 角色组
     */
    public void insertUserRole(String userGuid, String[] roleGuids) {
        if (roleGuids != null && roleGuids.length != 0) {
            // 新增用户与角色管理
            List<SysUserRole> list = new ArrayList<SysUserRole>(roleGuids.length);
            for (String roleGuid : roleGuids) {
                SysUserRole ur = new SysUserRole();
                ur.setUserGuid(userGuid);
                ur.setRoleGuid(roleGuid);
                list.add(ur);
            }
            sysRoleMapper.batchUserRole(list);
        }
    }

    /**
     * 新增用户岗位信息
     *
     * @param user 用户对象
     */
    public void insertUserPost(SysUser user) {
        String userGuid = user.getUserGuid();
        String[] postGuids = user.getPostGuids();
        if (postGuids != null && postGuids.length != 0) {
            // 新增用户与岗位管理
            List<SysUserPost> sysUserPostList = new ArrayList<SysUserPost>(postGuids.length);
            for (String postGuid : postGuids) {
                SysUserPost up = new SysUserPost();
                up.setUserGuid(userGuid);
                up.setPostGuid(postGuid);
                sysUserPostList.add(up);
            }
            sysRoleMapper.batchUserPost(sysUserPostList);
        }
    }

    /**
     * 校验用户名称是否唯一
     *
     * @param user 用户信息
     * @return 结果
     */
    @Override
    public boolean checkUserNameUnique(SysUser user) {
        SysUser sysUser = sysUserMapper.checkUserNameUnique(user.getUserName(), user.getUserGuid());
        return sysUser == null;
    }

    /**
     * 校验用户名称是否唯一
     *
     * @param user 用户信息
     * @return
     */
    @Override
    public boolean checkPhoneUnique(SysUser user) {
        SysUser sysUser = sysUserMapper.checkPhoneUnique(user.getPhonenumber(), user.getUserGuid());
        return sysUser == null;
    }

    /**
     * 校验email是否唯一
     *
     * @param user 用户信息
     * @return
     */
    @Override
    public boolean checkEmailUnique(SysUser user) {
        SysUser sysUser = sysUserMapper.checkEmailUnique(user.getEmail(), user.getUserGuid());
        return sysUser == null;
    }

    @Override
    @Transactional
    public void insertUser(SysUser user) {
        sysUserMapper.insertUser(user);
        //新增用户与岗位关联
        insertUserPost(user);
        // 新增用户与角色管理
        insertUserRole(user);
    }

    @Override
    public List<SysUser> selectAllocatedList(SysUser user) {
        return sysUserMapper.selectAllocatedList(user);
    }

    @Override
    public List<SysUser> selectUnallocatedList(SysUser user) {
        return sysUserMapper.selectUnallocatedList(user);
    }
}
