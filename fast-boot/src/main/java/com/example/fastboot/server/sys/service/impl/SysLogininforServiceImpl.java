package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.sys.mapper.SysLogininforMapper;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.example.fastboot.server.sys.service.ISysLogininforService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * 系统访问日志情况信息 服务层处理
 *
 * @author ruoyi
 */
@Service
public class SysLogininforServiceImpl implements ISysLogininforService {

    @Autowired
    private SysLogininforMapper sysLogininforMapper;

    /**
     * 新增系统登录日志
     *
     * @param logininfor 访问日志对象
     */
    @Override
    public void insertLogininfor(SysLogininfor logininfor) {
        sysLogininforMapper.insertLogininfor(logininfor);
    }

    /**
     * 删除指定登录日志
     *
     * @param guids 唯一标识
     * @return
     */
    @Override
    public void deleteLogininforByGuids(String[] guids) {
        sysLogininforMapper.deleteLogininforByGuids(guids);
    }

    /**
     * 情路登录日志
     */
    @Override
    public void cleanLogininfor() {
        sysLogininforMapper.cleanLogininfor();
    }

    /**
     * 获取登录日志
     *
     * @param logininfor 登录日志
     * @return 登录日志列表
     */
    @Override
    public PageResponse selectLogininforList(SysLogininfor logininfor) {
        PageHelper.startPage(logininfor.getCurrentPage(), logininfor.getPageSize());
        List<SysLogininfor> sysLogininforList = sysLogininforMapper.selectLogininforList(logininfor);
        PageInfo<SysLogininfor> sysLogininforPageInfo = new PageInfo<>(sysLogininforList);
        return new PageResponse<>(sysLogininforPageInfo);
    }
}
