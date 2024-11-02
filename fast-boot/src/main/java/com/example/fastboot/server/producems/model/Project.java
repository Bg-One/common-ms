package com.example.fastboot.server.producems.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    private int id;
    private String guid;
    private String name;
    private String projectNo;
    private int status;

    private String acceptReportLink;
    private int acceptanceFlag;

    private int executionStatus;

    private String produceGuid;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    private String deleteFlag;


    private int currentPage;

    private int pageSize;

    private String produceName;

    private String produceManagerName;

    private String technicalManagerName;

    private String projectManagerName;

    private String projectMemberList;
}
