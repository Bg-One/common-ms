package com.example.fastboot.server.sys.service;


import com.example.fastboot.server.sys.model.SysUser;

import java.util.List;

/**
 * @author liuzhaobo
 */
public interface ISysUserService {

    /**
     * 修改用户基本信息
     *
     * @param sysUser 用户信息
     * @return 结果
     */
    void updateUserProfile(SysUser sysUser);

    /**
     * 通过用户名查询用户
     *
     * @param userName 用户名
     * @return 用户对象信息
     */
    SysUser selectUserByUserName(String userName);

    /**
     * 根据条件分页查询用户列表
     *
     * @param user 用户信息
     * @return 用户信息集合信息
     */
    List<SysUser> selectUserList(SysUser user);

    /**
     * 根据用户唯一标识删除用户
     *
     * @param userGuid 用户唯一标识
     */
    void deleteUserByGuid(String userGuid);

    SysUser getSysUserByUserGuid(String userGuid);

    /**
     * 修改用户信息
     *
     * @param sysUser 用户信息
     */
    void updateUser(SysUser sysUser);

    /**
     * 重置密码
     *
     * @param sysUser 用户信息
     */
    void resetPwd(SysUser sysUser);

    /**
     * 修改用户状态
     *
     * @param sysUser 用户信息
     */
    void updateUserStatus(SysUser sysUser);

    /**
     * 检查用户名是否唯一
     *
     * @param user 用户信息
     * @return 是否唯一
     */
    boolean checkUserNameUnique(SysUser user);

    /**
     * 检查联系方式是否唯一
     *
     * @param user 用户信息
     * @return 是否唯一
     */
    boolean checkPhoneUnique(SysUser user);

    /**
     * 检查箱邮是否唯一
     *
     * @param user 用户信息
     * @return 是否唯一
     */
    boolean checkEmailUnique(SysUser user);

    /**
     * 新增用户
     *
     * @param user 用户信息
     */
    void insertUser(SysUser user);

    /**
     * 查询全部授权的用户
     *
     * @param user
     * @return 授权用户
     */
    List<SysUser> selectAllocatedList(SysUser user);

    /**
     * 查询全部未授权的用户
     *
     * @param user 用户信息
     * @return 未授权用户
     */
    List<SysUser> selectUnallocatedList(SysUser user);
}
