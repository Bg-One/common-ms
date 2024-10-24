package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 24 15 20
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentStatusCountVo {
    private int status;

    private int count;
}
