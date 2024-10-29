package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2023 11 07 11 50
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WorkDurationVo {
    private String createUserGuids;

    private String startTime;

    private String endTime;

    private String workTypeGuids;

    private String projectGuids;

    private String workCategoryGuids;


}
