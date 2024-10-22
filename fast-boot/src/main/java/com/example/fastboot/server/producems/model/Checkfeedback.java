package com.example.fastboot.server.producems.model;


import com.example.fastboot.common.config.DateJsonSerialize;
import com.example.fastboot.common.config.DateToDayJsonSerialize;
import com.example.fastboot.server.producems.vo.CheckFeedbackCountVo;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import liquibase.pro.packaged.S;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Checkfeedback {


    private int id;
    private String guid;
    private String demandeGuid;
    private String nodeGuid;
    private String produceGuid;

    private String projectGuid;
    private String questionDescription;
    private String imageLink;
    private Integer severity;
    @JsonSerialize(using = DateToDayJsonSerialize.class)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date feedbackTime;
    @JsonSerialize(using = DateToDayJsonSerialize.class)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dealFinishTime;
    private String submitName;
    private String checkConfirmName;
    private String developConfirmName;
    private String dealName;
    private int status;
    private String dealMethod;
    @JsonSerialize(using = DateToDayJsonSerialize.class)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date publishTime;
    private String notes;
    private String deleteFlag;

    private Integer saveImageFlag;

    private String produceName;
    private String nodeName;

    private int currentPage;

    private int pageSize;

    private String[] filterStatus;

    private String[] filterProjectList;
    private CheckFeedbackCountVo checkFeedbackCountVo;
}
