package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 *
 * @TableName nodes
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Nodes implements Serializable {
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
    private String moduleGuid;

    /**
     *
     */
    private String name;

    /**
     *
     */
    private Integer classType;

    /**
     *
     */
    private Boolean nodeType;

    /**
     *
     */
    private String parentNodeGuid;

    /**
     *
     */
    private Integer nodeOrder;

    /**
     *
     */
    private Boolean deleteFlag;

    private static final long serialVersionUID = 1L;

}
