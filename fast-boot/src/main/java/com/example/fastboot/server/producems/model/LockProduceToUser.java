package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author bo
 * @Date 2023 12 21 13 43
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LockProduceToUser {

    private long id;
    private String userGuid;
    private String produceGuid;

}
