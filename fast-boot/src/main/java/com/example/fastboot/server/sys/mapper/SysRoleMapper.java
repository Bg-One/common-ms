package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysRole;
import com.example.fastboot.server.sys.model.SysRoleMenu;
import com.example.fastboot.server.sys.model.SysUserPost;
import com.example.fastboot.server.sys.model.SysUserRole;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 24 16 25
 **/
@Repository
public interface SysRoleMapper {
    /**
     * 根据用户ID查询角色
     *
     * @param userGuid 用户唯一标识
     * @return 角色列表
     */
    List<SysRole> selectRolePermissionByUserId(String userGuid);

    /**
     * 删除角色用户管理关系
     *
     * @param userGuid
     */
    void deleteUserRole(String userGuid);


    /**
     * 新增用户角色关系
     *
     * @param list
     */
    void batchUserRole(List<SysUserRole> list);

    /**
     * 获取全部的角色列表
     *
     * @param role 角色对象
     * @return 角色列表
     */
    List<SysRole> selectRoleList(SysRole role);

    /**
     * 根据角色唯一标识删除角色
     *
     * @param roleGuid 角色唯一标识
     */
    void deleteRoleByRoleGuid(String roleGuid);

    /**
     * 删除角色权限关联关系
     *
     * @param roleGuid 角色唯一标识
     */
    void deleteRoleMenu(String roleGuid);

    /**
     * 统计用户关联该角色数量
     *
     * @param roleGuid 角色唯一标识
     * @return 数量
     */
    int countUserRoleByRoleGuid(String roleGuid);

    /**
     * 批量删除用户角色关联关系
     *
     * @param roleGuid  角色唯一标识
     * @param userGuids 用户唯一标识数组
     */
    void deleteUserRoleInfos(@Param("roleGuid") String roleGuid, @Param("userGuids") String[] userGuids);

    /**
     * 检测角色名是否唯一
     *
     * @param role 角色信息
     * @return 角色对象
     */
    SysRole checkRoleNameUnique(SysRole role);

    /**
     * 检测角色编码是否唯一
     *
     * @param role 角色信息
     * @return 角色对象
     */
    SysRole checkRoleKeyUnique(SysRole role);

    /**
     * 新增角色信息
     *
     * @param role 角色信息
     */
    void insertRole(SysRole role);

    /**
     * 新增角色与权限/菜单关系
     *
     * @param list
     */
    int batchRoleMenu(List<SysRoleMenu> list);

    /**
     * 更新角色信息
     *
     * @param role 角色信息
     */
    void updateRole(SysRole role);

    /**
     * 删除角色权限菜单关系
     *
     * @param roleGuid
     */
    void deleteRoleMenuByRoleGuid(String roleGuid);

    /**
     * 根据角色唯一标识获取系统角色
     *
     * @param roleGuid 角色唯一标识
     * @return 系统角色
     */
    SysRole selectRoleGuid(String roleGuid);

    /**
     * 新增用户岗位关联关系
     *
     * @param sysUserPostList
     */
    void batchUserPost(@Param("sysUserPostList") List<SysUserPost> sysUserPostList);
}
