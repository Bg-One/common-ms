package com.example.fastboot.common.response;

import com.example.fastboot.server.sys.model.SysDept;
import com.example.fastboot.server.sys.model.SysMenu;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;


import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;


/**
 * @author liuzhaobo
 */

@Data
public class TreeSelect implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 节点ID
     */
    private String guid;

    /**
     * 节点名称
     */
    private String label;

    /**
     * 子节点
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<TreeSelect> children;

    public TreeSelect() {

    }

    public TreeSelect(SysDept dept) {
        this.guid = dept.getDeptGuid();
        this.label = dept.getDeptName();
        this.children = dept.getChildren().stream().map(TreeSelect::new).collect(Collectors.toList());
    }

    public TreeSelect(SysMenu menu) {
        this.guid = menu.getMenuGuid();
        this.label = menu.getMenuName();
        this.children = menu.getChildren().stream().map(TreeSelect::new).collect(Collectors.toList());
    }

}
