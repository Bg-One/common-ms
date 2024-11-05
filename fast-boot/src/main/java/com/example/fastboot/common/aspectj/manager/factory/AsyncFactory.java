package com.example.fastboot.common.aspectj.manager.factory;


import cn.hutool.extra.spring.SpringUtil;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.utils.ip.AddressUtils;
import com.example.fastboot.common.utils.ip.IpUtils;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.example.fastboot.server.sys.model.SysOperLog;
import com.example.fastboot.server.sys.service.ISysLogininforService;
import com.example.fastboot.server.sys.service.ISysOperLogService;
import eu.bitwalker.useragentutils.UserAgent;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.TimerTask;
import java.util.UUID;

/**
 * 异步工厂（产生任务用）
 *
 * @author
 */
@Slf4j
public class AsyncFactory {

    /**
     * 记录登录信息
     *
     * @param userName 用户名
     * @param status   状态
     * @param message  消息
     * @param args     列表
     * @return 任务task
     */
    public static TimerTask recordLogininfor(final String userName, final String status, final String message,
                                             final Object... args) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
        final String ip = IpUtils.getIpAddr();
        return new TimerTask() {
            @Override
            public void run() {
                String address = AddressUtils.getRealAddressByIP(ip);
                // 获取客户端操作系统
                String os = userAgent.getOperatingSystem().getName();
                // 获取客户端浏览器
                String browser = userAgent.getBrowser().getName();

                // 封装对象
                SysLogininfor logininfor = new SysLogininfor();
                logininfor.setInfoGuid(UUID.randomUUID().toString());
                logininfor.setUserName(userName);
                logininfor.setIpaddr(ip);
                logininfor.setLoginLocation(address);
                logininfor.setBrowser(browser);
                logininfor.setOs(os);
                logininfor.setMsg(message);
                // 日志状态
                if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER)) {
                    logininfor.setStatus(String.valueOf(CommonResultEnum.SUCCESS.getCode()));
                } else if (Constants.LOGIN_FAIL.equals(status)) {
                    logininfor.setStatus(String.valueOf(CommonResultEnum.FAILED.getCode()));
                }
                // 插入数据
                SpringUtil.getBean(ISysLogininforService.class).insertLogininfor(logininfor);
            }
        };
    }

    /**
     * 操作日志记录
     *
     * @param operLog 操作日志信息
     * @return 任务task
     */
    public static TimerTask recordOper(final SysOperLog operLog) {
        return new TimerTask() {
            @Override
            public void run() {
                // 远程查询操作地点
                operLog.setOperLocation(AddressUtils.getRealAddressByIP(operLog.getOperIp()));
                SpringUtil.getBean(ISysOperLogService.class).insertOperlog(operLog);
            }
        };
    }
}
