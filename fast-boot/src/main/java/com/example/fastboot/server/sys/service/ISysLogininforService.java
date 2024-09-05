package com.example.fastboot.server.sys.service;


import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.sys.model.SysLogininfor;

import java.util.List;

/**
 * @author liuzhaobo
 */
public interface ISysLogininforService {

    /**
     * 插入登陆日志
     *
     * @param logininfor 日志登录信息
     */
    void insertLogininfor(SysLogininfor logininfor);

    /**
     * 删除登录日志
     *
     * @param guids 唯一标识数组
     */
    void deleteLogininforByGuids(String[] guids);

    /**
     * 情路登录日志
     */
    void cleanLogininfor();

    /**
     * 分页查询登录信息
     *
     * @param logininfor 登录信息
     * @return
     */
    PageResponse selectLogininforList(SysLogininfor logininfor);
}
