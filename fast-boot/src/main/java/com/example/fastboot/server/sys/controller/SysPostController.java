package com.example.fastboot.server.sys.controller;


import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.server.sys.model.SysPost;
import com.example.fastboot.server.sys.service.ISysPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;



/**
 * @author liuzhaobo
 */
@RestController
@RequestMapping("/post")
public class SysPostController {
    @Autowired
    private ISysPostService iSysPostService;

    /**
     * 获取岗位列表
     */
    @PreAuthorize("@permission.hasAuthority('system:post:list')")
    @PostMapping("/listSysPost")
    public Object listSysPost(SysPost sysPost) {
        return CommonResult.success(iSysPostService.selectPostList(sysPost));
    }


    /**
     * 新增岗位
     */
    @PreAuthorize("@permission.hasAuthority('system:post:add')")
    @SysLog(title = "岗位管理", businessType = BusinessType.INSERT)
    @PostMapping("addSysPost")
    public Object addSysPost(SysPost sysPost) {
        if (!iSysPostService.checkPostNameUnique(sysPost)) {
            return new ServiceException(CommonResultEnum.POST_NAME_EXIT_DISABLE);
        } else if (!iSysPostService.checkPostCodeUnique(sysPost)) {
            return new ServiceException(CommonResultEnum.POST_CODE_EXIT_DISABLE);
        }
        sysPost.setCreateBy(Base.getCreatUserName());
        iSysPostService.insertPost(sysPost);
        return CommonResult.success();
    }

    /**
     * 修改岗位
     */
    @PreAuthorize("@permission.hasAuthority('system:post:edit')")
    @SysLog(title = "岗位管理", businessType = BusinessType.UPDATE)
    @PostMapping("updateSysPost")
    public Object updateSysPost( SysPost post) {
        if (!iSysPostService.checkPostNameUnique(post)) {
            return new ServiceException(CommonResultEnum.POST_NAME_EXIT_DISABLE);
        } else if (!iSysPostService.checkPostCodeUnique(post)) {
            return new ServiceException(CommonResultEnum.POST_CODE_EXIT_DISABLE);
        }
        post.setUpdateBy(Base.getCreatUserName());
        iSysPostService.updatePost(post);
        return CommonResult.success();
    }

    /**
     * 删除岗位
     */
    @PreAuthorize("@permission.hasAuthority('system:post:remove')")
    @SysLog(title = "岗位管理", businessType = BusinessType.DELETE)
    @PostMapping("/delSysPost")
    public Object delSysPost(String[] postGuids) {
        iSysPostService.deletePostByGuids(postGuids);
        return CommonResult.success();
    }

}
