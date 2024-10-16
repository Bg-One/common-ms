package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @TableName producemember
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Producemember implements Serializable {
    /**
     *
     */

    private Integer id;

    /**
     *
     */
    private String produceManageGuid;

    /**
     *
     */
    private Integer teamResource;

    /**
     *
     */
    private String managerGuid;

    /**
     *
     */
    private String groupMemsGuids;


    private String managerName;

    /**
     *
     */
    private String groupMemsNames;
    private static final long serialVersionUID = 1L;


}
