package com.example.fastboot.server.sys.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.example.fastboot.server.sys.model.SysOperLog;
import com.example.fastboot.server.sys.service.ISysLogininforService;
import com.example.fastboot.server.sys.service.ISysOperLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


/**
 * @Author bo
 * @Date 2024 08 07 10 26
 **/
@RestController
@RequestMapping("/log")
public class SysLogController {
    @Autowired
    private ISysLogininforService logininforService;
    @Autowired
    private ISysOperLogService operLogService;

    /**
     * 获取登录日志
     *
     * @param logininfor 登录日志
     * @return 登录日志列表
     */
    @PreAuthorize("@permission.hasAuthority('monitor:logininfor:list')")
    @PostMapping("/listSysLogininfor")
    public Object listSysLogininfor(SysLogininfor logininfor) {
        return CommonResult.success(logininforService.selectLogininforList(logininfor));
    }

    /**
     * 删除指定登录日志
     *
     * @param guids 唯一标识
     * @return
     */
    @SysLog(title = "登录日志", businessType = BusinessType.DELETE)
    @PostMapping("/removeLoginLogByGuids")
    public Object removeLoginLogByGuids(String[] guids) {
        logininforService.deleteLogininforByGuids(guids);
        return CommonResult.success();
    }

    /**
     * 清空日志
     *
     * @return
     */
    @SysLog(title = "登录日志", businessType = BusinessType.CLEAN)
    @PostMapping("/cleanLoginLog")
    public Object cleanLoginLog() {
        logininforService.cleanLogininfor();
        return CommonResult.success();
    }

    /**
     * 获取全部操作日志
     *
     * @param operLog
     * @return
     */
    @PostMapping("/listOperLog")
    public Object listOperateLog(SysOperLog operLog) {
        return CommonResult.success(operLogService.selectOperLogList(operLog));
    }

    /**
     * 删除指定操作日志
     *
     * @param operGuids
     * @return
     */
    @SysLog(title = "操作日志", businessType = BusinessType.DELETE)
    @PostMapping("/removeOperLogByGuids")
    public Object removeOperLogByGuids(String[] operGuids) {
        operLogService.deleteOperLogByGuids(operGuids);
        return CommonResult.success();
    }

    /**
     * 清空操作日志
     *
     * @return
     */
    @SysLog(title = "操作日志", businessType = BusinessType.CLEAN)
    @PostMapping("/cleanOperLog")
    public Object cleanOperLog() {
        operLogService.cleanOperLog();
        return CommonResult.success();
    }
}
