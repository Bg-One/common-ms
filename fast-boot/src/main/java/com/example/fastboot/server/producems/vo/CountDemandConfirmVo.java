package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 16 21 30
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountDemandConfirmVo {
    private int demandConfiemedState;

    private int count;
}
