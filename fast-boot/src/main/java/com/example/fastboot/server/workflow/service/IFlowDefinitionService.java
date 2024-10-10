package com.example.fastboot.server.workflow.service;


import com.example.fastboot.server.workflow.vo.FlowProcDefDto;

import java.io.InputStream;
import java.util.List;

/**
 * @author liuzhaobo
 */
public interface IFlowDefinitionService {


    /**
     * 导入流程定义
     *
     * @param name
     * @param category
     * @param in
     */
    void importFile(String name, String category, InputStream in);

    /**
     * 获取流程定义列表
     *
     * @return
     */
    List<FlowProcDefDto> list();

}
