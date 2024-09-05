package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysMenu;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 24 16 34
 **/
@Repository
public interface SysMenuMapper {
    /**
     * 根据角色ID查询权限
     *
     * @param roleGuid 角色唯一标识
     * @return 权限列表
     */
    List<String> selectMenuPermsByRoleGuid(String roleGuid);

    /**
     * 根据用户ID查询权限
     *
     * @param userGuid 用户userGuid
     * @return 权限列表
     */
    List<String> selectMenuPermsByUserId(String userGuid);

    /**
     * 获取全部菜单列表
     *
     * @param sysMenu 系统菜单
     * @return 系统菜单列表
     */
    List<SysMenu> selectMenuList(SysMenu sysMenu);

    /**
     * 获取指定人员菜单列表
     *
     * @param sysMenu  系统菜单
     * @param userGuid 用户唯一标识
     * @return 系统菜单列表
     */
    List<SysMenu> selectMenuListByUserGuid(@Param("sysMenu") SysMenu sysMenu, @Param("userGuid") String userGuid);

    /**
     * 根据菜单唯一标识
     *
     * @param menuGuid
     */
    void deleteMenuByGuid(String menuGuid);

    /**
     * 是否存在子菜单
     *
     * @param menuGuid 菜单唯一标识
     * @return 存在子菜单
     */
    int hasChildByMenuGuid(String menuGuid);

    /**
     * 检查菜单是否被角色使用
     *
     * @param menuGuid
     * @return
     */
    int checkMenuExistRole(String menuGuid);

    /**
     * 菜单名是否唯一
     *
     * @param menuName   菜单名
     * @param menuGuid   菜单唯一标识
     * @param parentGuid 父菜单唯一标识
     * @return
     */
    SysMenu checkMenuNameUnique(@Param("menuName") String menuName, @Param("menuGuid") String menuGuid, @Param("parentGuid") String parentGuid);

    /**
     * 新增菜单
     *
     * @param menu
     */
    void insetMenu(SysMenu menu);

    /**
     * 菜单更新
     *
     * @param menu 菜单对象
     */
    void updateMenu(SysMenu menu);

    /**
     * @param roleGuid
     * @param menuCheckStrictly
     * @return
     */
    List<String> selectMenuListByRoleGuid(String roleGuid, boolean menuCheckStrictly);

    /**
     * 获取全部菜单
     *
     * @return 全部菜单
     */
    List<SysMenu> selectMenuTreeAll();

    /**
     * 根据用户唯一标识获取菜单
     * @param userGuid 用户唯一标识
     * @return
     */
    List<SysMenu> selectMenuTreeByUserGuid(String userGuid);
}
