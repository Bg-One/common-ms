package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @Author bo
 * @Date 2024 11 07 14 33
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyReportDetail {
    private int id;
    private String guid;
    private String weeklyReportGuid;
    private String content;
    private String managerGuid;
    private String managerName;
    private Date createTime;
    private int progress;
    private int weeklyDetailType;
    private Boolean deleteFlag;
}
