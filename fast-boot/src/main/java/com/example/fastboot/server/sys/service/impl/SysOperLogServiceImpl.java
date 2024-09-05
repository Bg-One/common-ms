package com.example.fastboot.server.sys.service.impl;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.sys.mapper.SysOperLogMapper;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.example.fastboot.server.sys.model.SysOperLog;
import com.example.fastboot.server.sys.service.ISysOperLogService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 25 20 47
 **/
@Service
public class SysOperLogServiceImpl implements ISysOperLogService {

    @Autowired
    private SysOperLogMapper operLogMapper;

    /**
     * 新增操作日志
     *
     * @param operLog 操作日志对象
     */
    @Override
    public void insertOperlog(SysOperLog operLog) {
        operLogMapper.insertOperlog(operLog);
    }

    /**
     * 获取全部操作日志
     *
     * @param operLog
     * @return
     */
    @Override
    public PageResponse selectOperLogList(SysOperLog operLog) {
        PageHelper.startPage(operLog.getCurrentPage(), operLog.getPageSize());
        List<SysOperLog> selectOperLogList = operLogMapper.selectOperLogList(operLog);
        PageInfo<SysOperLog> sysOperLogPageInfo = new PageInfo<>(selectOperLogList);
        return new PageResponse<>(sysOperLogPageInfo);
    }

    /**
     * 删除指定操作日志
     *
     * @param operGuids
     */
    @Override
    public void deleteOperLogByGuids(String[] operGuids) {
        operLogMapper.deleteOperLogByGuids(operGuids);
    }

    /**
     * 清空操作日志
     */
    @Override
    public void cleanOperLog() {
        operLogMapper.cleanOperLog();
    }
}
