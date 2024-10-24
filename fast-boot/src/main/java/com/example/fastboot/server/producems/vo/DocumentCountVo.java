package com.example.fastboot.server.producems.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2024 10 24 15 17
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentCountVo {
    private int allCount;
    private int editCount;
    private int previewCount;
    private int finalCount;
}
