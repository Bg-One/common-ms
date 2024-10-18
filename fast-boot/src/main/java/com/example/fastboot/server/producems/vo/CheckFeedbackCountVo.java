package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 18 09 16
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckFeedbackCountVo {

    private int totalCount;
    private int checkWaitConfirmCount;
    private int devWaitConfirmCount;
    private int revisingCount;
    private int waitRetestCount;
    private int noPassedCount;
    private int passedCount;
    private int reopenCount;

}
