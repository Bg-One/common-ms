package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 *
 * @TableName workorderitem
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workorderitem implements Serializable {
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
    private String workOrderCategoryGuid;

    private static final long serialVersionUID = 1L;

}
