package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysPost;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 09 01 17 08
 **/
@Repository
public interface SysPostMapper {

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
     * 通过岗位Guid查询岗位信息
     *
     * @param postGuid 岗位唯一标识
     * @return 角色对象信息
     */
    SysPost selectPostByGuid(String postGuid);

    /**
     * 删除岗位
     *
     * @param postGuids
     */
    void deletePostByGuids(String[] postGuids);

    /**
     * 岗位名是否唯一
     *
     * @param SysPost
     * @return
     */
    SysPost checkPostNameUnique(SysPost sysPost);

    /**
     * 岗位编码是否唯一
     *
     * @param SysPost
     * @return
     */
    SysPost checkPostCodeUnique(SysPost sysPost);

    /**
     * 更新岗位
     *
     * @param post
     */
    void updatePost(SysPost post);
}
