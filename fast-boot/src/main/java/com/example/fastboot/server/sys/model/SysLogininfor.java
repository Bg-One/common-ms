package com.example.fastboot.server.sys.model;

import com.example.fastboot.server.sys.vo.TimeRangeVo;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.scheduling.annotation.Async;

import java.io.Serializable;
import java.util.Date;


/**
 * @author liuzhaobo
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysLogininfor extends TimeRangeVo implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    private Long id;

    /**
     * 登录信息唯一标识
     */
    private String infoGuid;

    /**
     * 用户账号
     */
    private String userName;

    /**
     * 登录状态 0成功 1失败
     */
    private String status;

    /**
     * 登录IP地址
     */
    private String ipaddr;

    /**
     * 登录地点
     */
    private String loginLocation;

    /**
     * 浏览器类型
     */
    private String browser;

    /**
     * 操作系统
     */
    private String os;

    /**
     * 提示消息
     */
    private String msg;

    /**
     * 访问时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date loginTime;


    private int currentPage;

    private int pageSize;

}
