package com.example.fastboot.server.sys.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.io.Serializable;


/**
 * @author liuzhaobo
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysUserRole implements Serializable {

    /**
     * 用户唯一标识
     */
    private String userGuid;

    /**
     * 角色唯一标识
     */
    private String roleGuid;

}
