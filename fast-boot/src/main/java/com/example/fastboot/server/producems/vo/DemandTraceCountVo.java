package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 22 20 25
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandTraceCountVo {

    private int totalCount;

    private int waitConfirmCount;

    private int waitEditCount;

    private int waitReviewCount;

    private int waitDevelopConfirmCount;

    private int waitDevelopFinishCount;

    private int waitDemandConfirmCount;

    private int waitCheckCount;

    private int hangCount;

    private int suspendCount;

    private int voidCount;

    private int finishCount;

}
