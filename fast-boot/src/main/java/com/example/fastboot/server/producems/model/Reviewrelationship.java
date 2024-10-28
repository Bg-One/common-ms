package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 *
 * @TableName reviewrelationship
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reviewrelationship implements Serializable {
    /**
     *
     */
    private String userGuid;

    /**
     *
     */
    private String reviewGuid;

    private static final long serialVersionUID = 1L;


}
