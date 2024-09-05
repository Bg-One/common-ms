package com.example.fastboot.server.sys.service.impl;

import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.server.sys.mapper.SysPostMapper;
import com.example.fastboot.server.sys.mapper.SysUserMapper;
import com.example.fastboot.server.sys.model.SysPost;
import com.example.fastboot.server.sys.service.ISysPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 09 01 17 03
 **/
@Service
public class SysPostServiceImpl implements ISysPostService {
    @Autowired
    private SysPostMapper sysPostMapper;
    @Autowired
    private SysUserMapper sysUserMapper;

    /**
     * 获取岗位信息列表
     *
     * @param sysPost
     * @return
     */
    @Override
    public List<SysPost> selectPostList(SysPost sysPost) {
        return sysPostMapper.selectPostList(sysPost);
    }

    @Override
    public void insertPost(SysPost sysPost) {
        sysPost.setPostGuid(UUID.randomUUID().toString());
        sysPostMapper.insertPost(sysPost);
    }

    @Override
    public boolean checkPostNameUnique(SysPost sysPost) {
        SysPost info = sysPostMapper.checkPostNameUnique(sysPost);
        return info == null;
    }

    @Override
    public boolean checkPostCodeUnique(SysPost sysPost) {
        SysPost info = sysPostMapper.checkPostCodeUnique(sysPost);
        return info == null;
    }

    @Override
    public void updatePost(SysPost post) {
        sysPostMapper.updatePost(post);
    }

    @Override
    public void deletePostByGuids(String[] postGuids) {
        for (String postGuid : postGuids) {
            if (countUserPostByGuid(postGuid) > 0) {
                throw new ServiceException(CommonResultEnum.POST_ALLOCATION_DISABLE);
            }
        }
        sysPostMapper.deletePostByGuids(postGuids);
    }

    /**
     * 通过岗位Guid查询岗位信息
     *
     * @param postGuid 岗位唯一标识
     * @return 角色对象信息
     */
    @Override
    public SysPost selectPostByGuid(String postGuid) {
        return sysPostMapper.selectPostByGuid(postGuid);
    }

    /**
     * 通过岗位guid查询岗位使用数量
     *
     * @param postGuid 岗位guid
     * @return 结果
     */
    @Override
    public int countUserPostByGuid(String postGuid) {
        return sysUserMapper.countUserPostByGuid(postGuid);
    }
}
