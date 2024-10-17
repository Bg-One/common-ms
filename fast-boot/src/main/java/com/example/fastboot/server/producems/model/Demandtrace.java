package com.example.fastboot.server.producems.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author liuzhaobo
 * @TableName demandtrace
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Demandtrace implements Serializable {

    /**
     *
     */
    private Integer id;

    /**
     * 需求跟踪唯一标识
     */
    private String guid;

    private String produceGuid;

    private String projectGuid;
    /**
     * 所属节点guid
     */
    private String nodeGuid;

    /**
     * 创建时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    /**
     * 需求类型
     */
    private int demandType;

    /**
     * 需求描述
     */
    private String demandDescription;

    /**
     * 提出人
     */
    private String proposer;

    /**
     * 提交人
     */
    private String submitName;

    /**
     * 提交时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submitTime;

    /**
     * 优先级
     */
    private Integer priority;

    /**
     * 技术负责人
     */
    private String techManager;

    /**
     * 是否评审
     */
    private int reviewFlag;

    /**
     * 需求人员
     */
    private String demandName;

    /**
     * 评审确认
     */
    private String reviewName;

    /**
     * 开发确认
     */
    private String developName;

    /**
     * 开发完成
     */
    private String devlopFinishName;

    /**
     * 需求确认
     */
    private String demandConfirmName;

    /**
     * 测试确认
     */
    private String checkName;

    /**
     * 处理状态
     */
    private Integer dealState;

    /**
     * 完结时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date finishTime;

    /**
     * 备注
     */
    private String notes;

    /**
     * 详细描述
     */
    private String detailDescription;

    /**
     * 删除标志
     */
    private int deleteFlag;

    private static final long serialVersionUID = 1L;


}
