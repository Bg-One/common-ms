package com.example.fastboot.server.workflow.vo;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>流程定义<p>
 *
 * @author Tony
 * @date 2021-04-03
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlowProcDefDto implements Serializable {

    private String id;

    private String name;

    private String flowKey;

    private String category;

    private String formName;

    private Long formId;

    private int version;

    private String deploymentId;

    private int suspensionState;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date deploymentTime;


}
