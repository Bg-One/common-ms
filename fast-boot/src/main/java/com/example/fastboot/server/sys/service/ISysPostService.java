package com.example.fastboot.server.sys.service;

import com.example.fastboot.server.sys.model.SysPost;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 09 01 17 03
 **/
public interface ISysPostService {
    /**
     * 获取岗位列表
     *
     * @param sysPost
     * @return
     */
    List<SysPost> selectPostList(SysPost sysPost);

    /**
     * 新增岗位
     *
     * @param sysPost
     */
    void insertPost(SysPost sysPost);

    /**
     * 校验岗位名称是否唯一
     *
     * @param sysPost
     * @return
     */
    boolean checkPostNameUnique(SysPost sysPost);

    /**
     * 校验岗位编码是否唯一
     *
     * @param sysPost
     * @return
     */
    boolean checkPostCodeUnique(SysPost sysPost);

    /**
     * 更新岗位
     *
     * @param post
     */
    void updatePost(SysPost post);

    /**
     * 删除岗位
     *
     * @param postGuids
     */
    void deletePostByGuids(String[] postGuids);

    /**
     * 通过岗位唯一标识查询岗位信息
     *
     * @param postGuid 岗位唯一标识
     * @return 角色对象信息
     */
    SysPost selectPostByGuid(String postGuid);

    /**
     * 通过岗位guid查询岗位使用数量
     *
     * @param postGuid 岗位guid
     * @return 结果
     */

    int countUserPostByGuid(String postGuid);
}
