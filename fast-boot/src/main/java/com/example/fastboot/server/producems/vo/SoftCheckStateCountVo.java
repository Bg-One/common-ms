package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 18 09 23
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SoftCheckStateCountVo {
    private int softCheckState;

    private int count;
}
