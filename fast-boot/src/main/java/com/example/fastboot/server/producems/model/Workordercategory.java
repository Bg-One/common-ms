package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 *
 * @TableName workordercategory
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workordercategory implements Serializable {
    /**
     *
     */
    private Integer id;

    /**
     *
     */
    private String guid;

    /**
     *
     */
    private String name;

    /**
     *
     */
    private String workOrderTypeGuid;


    private static final long serialVersionUID = 1L;

}
