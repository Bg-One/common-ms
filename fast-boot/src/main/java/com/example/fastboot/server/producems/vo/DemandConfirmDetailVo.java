package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 17 08 59
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandConfirmDetailVo {

    private String demandGuid;
    private String[] demandConfirmedState;
    private String severity;
    private int currentPage;
    private int pageSize;
}
