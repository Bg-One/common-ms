package com.example.fastboot.server.sys.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * @author liuzhaobo
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysUserPost {
    /**
     * 用户唯一标识
     */
    private String userGuid;

    /**
     * 岗位唯一标识
     */
    private String postGuid;

}
