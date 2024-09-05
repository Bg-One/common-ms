package com.example.fastboot.server.sys.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


/**
 * @author liuzhaobo
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SysRoleDept implements Serializable {
    /**
     * 角色唯一标识
     */
    private String roleGuid;

    /**
     * 部门唯一标识
     */
    private String deptGuid;

}
