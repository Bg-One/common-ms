package com.example.fastboot.server.workflow.service.impl;

import com.example.fastboot.server.workflow.factory.FlowServiceFactory;
import com.example.fastboot.server.workflow.mapper.FlowDeployMapper;
import com.example.fastboot.server.workflow.service.IFlowDefinitionService;
import com.example.fastboot.server.workflow.vo.FlowProcDefDto;
import lombok.extern.slf4j.Slf4j;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

/**
 * @Author bo
 * @Date 2024 09 28 21 45
 **/
@Service
@Slf4j
public class IFlowDefinitionServiceImpl extends FlowServiceFactory implements IFlowDefinitionService {

    private static final String BPMN_FILE_SUFFIX = ".bpmn";
    @Resource
    private FlowDeployMapper flowDeployMapper;

    @Override
    public void importFile(String name, String category, InputStream in) {
        Deployment deploy = repositoryService.createDeployment().addInputStream(name + BPMN_FILE_SUFFIX, in).name(name).category(category).deploy();
        ProcessDefinition definition = repositoryService.createProcessDefinitionQuery().deploymentId(deploy.getId()).singleResult();
        repositoryService.setProcessDefinitionCategory(definition.getId(), category);
    }

    @Override
    public List<FlowProcDefDto> list() {
        return flowDeployMapper.selectDeployList();
    }
}
