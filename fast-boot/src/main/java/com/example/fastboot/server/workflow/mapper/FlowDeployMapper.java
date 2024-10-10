package com.example.fastboot.server.workflow.mapper;


import com.example.fastboot.server.workflow.vo.FlowProcDefDto;

import java.util.List;


/**
 * @author liuzhaobo
 */
public interface FlowDeployMapper {

    /**
     * 流程定义列表
     *
     * @return
     */
    List<FlowProcDefDto> selectDeployList();
}
