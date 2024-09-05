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
public class SysRoleMenu implements Serializable {
    /**
     * 角色唯一标识
     */
    private String roleGuid;

    /**
     * 菜单唯一标识
     */
    private String menuGuid;

}
