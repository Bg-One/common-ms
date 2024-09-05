package com.example.fastboot.server.sys.service;


import com.example.fastboot.server.sys.model.SysRole;

import java.util.List;
import java.util.Set;

/**
 * @author liuzhaobo
 */
public interface ISysRoleService {
    /**
     * 根据用户ID查询角色权限
     *
     * @param userGuid 用户唯一标识
     * @return 权限列表
     */
    Set<String> selectRolePermissionByUserId(String userGuid);

    /**
     * 获取角色列表
     *
     * @param role 角色对象
     * @return 角色列表
     */
    List<SysRole> selectRoleList(SysRole role);

    /**
     * 根据角色唯一标识删除角色
     *
     * @param roleGuid
     */
    void deleteRoleByRoleGuid(String roleGuid);

    /**
     * 该角色下分配用户数
     *
     * @param roleGuid 角色唯一标识
     * @return 数量
     */
    int countUserRoleByRoleGuid(String roleGuid);

    /**
     * 取消授权
     *
     * @param roleGuid  角色唯一标识
     * @param userGuids 用户唯一标识数组
     */
    void deleteAuthUsers(String roleGuid, String[] userGuids);

    /**
     * 进行角色授权
     *
     * @param roleGuid  角色唯一标识
     * @param userGuids 用户唯一标识数组
     */
    void insertAuthUsers(String roleGuid, String[] userGuids);

    /**
     * 检测角色名是否唯一
     *
     * @param role 角色信息
     * @return 是否唯一
     */
    boolean checkRoleNameUnique(SysRole role);

    /**
     * 检测角色编码是否唯一
     *
     * @param role 角色信息
     * @return 是否唯一
     */
    boolean checkRoleKeyUnique(SysRole role);

    /**
     * 新增角色
     *
     * @param role
     */
    void insertRole(SysRole role);


    /**
     * 更新角色
     *
     * @param role 角色
     * @return 变更数量
     */
    int updateRole(SysRole role);
}
