package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * @Author bo
 * @Date 2024 11 07 14 15
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyReport {

    private int id;
    private String guid;
    private String name;
    private String planContent;
    private String questionContent;
    private int weeklyReportType;
    private String deptGuid;
    private String projectGuids;
    private String produceGuid;
    private String managerGuids;
    private Date createTime;
    private int hideFlag;
    private Boolean deleteFlag;
    private String startTime;
    private String endTime;

    private List<WeeklyReportDetail> weeklyReportDetailList;

    private String weeklyReportDetailJson;

}
