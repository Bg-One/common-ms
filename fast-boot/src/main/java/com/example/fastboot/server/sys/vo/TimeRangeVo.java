package com.example.fastboot.server.sys.vo;

import com.alibaba.fastjson2.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 08 07 13 52
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TimeRangeVo {

    @JsonIgnore
    private String startTime;
    @JsonIgnore
    private String endTime;
}
