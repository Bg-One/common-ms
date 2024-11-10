package com.example.fastboot.server.sys.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.example.fastboot.server.sys.model.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 24 14 36
 **/
@Repository
public interface SysUserMapper {

    /**
     * 更新用户基本信息
     *
     * @param sysUser 用户基本信息
     */
    void updateUser(SysUser sysUser);

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
     * @param sysUser 用户信息
     * @return 用户信息集合信息
     */
    List<SysUser> selectUserList(SysUser sysUser);

    /**
     * 删除用户
     *
     * @param userGuid 用户唯一标识
     */
    void deleteUserByUserGuid(String userGuid);

    /**
     * 获取用户根据用户唯一标识
     *
     * @param userGuid 用户唯一标识
     * @return
     */
    SysUser getSysUserByUserGuid(String userGuid);

    /**
     * 根据用户名获取用户信息
     *
     * @param userName 用户名
     * @param userGuid 用户唯一标识
     * @return 用户信息
     */
    SysUser checkUserNameUnique(String userName, String userGuid);

    /**
     * 根据用户联系方式获取用户信息
     *
     * @param phoneNumber 联系方式
     * @param userGuid    用户唯一标识
     * @return 用户信息
     */
    SysUser checkPhoneUnique(@Param("phoneNumber") String phoneNumber, @Param("userGuid") String userGuid);

    /**
     * 根据邮箱获取用户信息
     *
     * @param email    邮箱
     * @param userGuid 用户唯一标识
     * @return 用户信息
     */
    SysUser checkEmailUnique(String email, String userGuid);

    /**
     * 新增用户
     *
     * @param user 系统用户
     */
    void insertUser(SysUser user);

    /**
     * 获取全部授权对象
     *
     * @param user 用户信息
     * @return
     */
    List<SysUser> selectAllocatedList(SysUser user);

    /**
     * 获取全部未授权对象
     *
     * @param user 用户信息
     * @return
     */
    List<SysUser> selectUnallocatedList(SysUser user);

    /**
     * 通过岗位guid查询岗位使用数量
     *
     * @param postGuid 岗位guid
     * @return 结果
     */
    int countUserPostByGuid(String postGuid);

    /**
     * 删除用户岗位关联关系
     *
     * @param userGuid
     */
    void deleteUserPostByUserGuid(String userGuid);

    /**
     * 根据部门guid查询用户
     * @param deptGuid
     * @return
     */
    List<SysUser> listUserByDept(String deptGuid);
}
