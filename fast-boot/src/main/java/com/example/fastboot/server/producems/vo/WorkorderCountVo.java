package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 11 04 20 09
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkorderCountVo {
    private int waitSubmitCount;
    private int checkFaildCount;
    private int waitCheckCount;
    private int checkCount;

}
