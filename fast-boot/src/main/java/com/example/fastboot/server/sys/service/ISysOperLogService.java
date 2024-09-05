package com.example.fastboot.server.sys.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.sys.model.SysOperLog;

/**
 * @Author bo
 * @Date 2024 07 25 20 47
 **/
public interface ISysOperLogService {
    /**
     * 新增操作日志
     *
     * @param operLog 操作日志对象
     */
    void insertOperlog(SysOperLog operLog);

    /**
     * 获取全部操作日志
     *
     * @param operLog
     * @return
     */
    PageResponse selectOperLogList(SysOperLog operLog);

    /**
     * 删除指定操作日志
     *
     * @param operGuids
     * @return
     */
    void deleteOperLogByGuids(String[] operGuids);

    /**
     * 清空操作日志
     */
    void cleanOperLog();

}
