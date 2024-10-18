package com.example.fastboot.server.producems.vo;

import liquibase.pro.packaged.D;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 18 09 12
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandConfirmCountVo {
    private int demandCount;

    private int devFinishedCount;

    private int waitConfirmCount;

    private int confirmedCount;

    private int noPassCount;
}
