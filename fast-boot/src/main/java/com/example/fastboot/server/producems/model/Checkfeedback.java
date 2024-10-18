package com.example.fastboot.server.producems.model;


import com.example.fastboot.server.producems.vo.CheckFeedbackCountVo;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date feedbackTime;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date dealFinishTime;
    private String submitName;
    private String checkConfirmName;
    private String developConfirmName;
    private String dealName;
    private int status;
    private String dealMethod;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date publishTime;
    private String notes;
    private String deleteFlag;

    private Integer saveImageFlag;

    private String produceName;
    private CheckFeedbackCountVo checkFeedbackCountVo;
}
