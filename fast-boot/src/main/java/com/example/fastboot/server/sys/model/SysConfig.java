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
public class SysConfig implements Serializable {
    private static final long serialVersionUID = 1L;
    /**
     * 配置key
     */
    private String name;
    /**
     * 配置的值
     */
    private String configValue;
    /**
     * 所属组别/模块
     */
    private String configGroup;
    /**
     * 描述/备注
     */
    private String description;

}
