package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysOperLog;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 25 20 55
 **/
@Repository
public interface SysOperLogMapper {
    /**
     * 新增操作日志
     *
     * @param operLog 操作日志对象
     */
    void insertOperlog(SysOperLog operLog);

    /**
     * 清空操作日志
     */
    void cleanOperLog();

    /**
     * 删除指定操作日志
     *
     * @param operGuids
     */
    void deleteOperLogByGuids(String[] operGuids);

    /**
     * 获取操作日志
     *
     * @param operLog 操作日志对象
     * @return
     */
    List<SysOperLog> selectOperLogList(SysOperLog operLog);
}
