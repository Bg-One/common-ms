package com.example.fastboot.server.producems.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.common.enums.TeamResourceEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.mapper.ProjectMapper;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.model.Producemember;
import com.example.fastboot.server.producems.model.Project;
import com.example.fastboot.server.producems.model.Projectmember;
import com.example.fastboot.server.producems.service.IProjectService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 10 16 15 36
 **/
@Service
@Transactional
public class IProjectServiceImpl implements IProjectService {
    @Autowired
    private ProjectMapper projectMapper;

    @Override
    public PageResponse listProject(Project project) {
        PageHelper.startPage(project.getCurrentPage(), project.getPageSize());
        List<Project> projectList = projectMapper.listProject(project);
        for (Project item : projectList) {
            //获取资源分类
            List<Projectmember> projectmemberList = projectMapper.listProduceMember(item.getGuid());
            for (Projectmember projectmember : projectmemberList) {
                Integer teamResource = projectmember.getTeamResource();
                if (teamResource == TeamResourceEnum.TECHNICAL_GROUP.getCode()) {
                    item.setTechnicalManagerName(projectmember.getManagerName());
                } else if (teamResource == TeamResourceEnum.PROJECT_GROUP.getCode()) {
                    item.setProjectManagerName(projectmember.getManagerName());
                }
            }
        }
        PageInfo<Project> projectPageInfo = new PageInfo<>(projectList);
        return new PageResponse<>(projectPageInfo);
    }

    @Override
    public void addOrEditProject(Project project) {
        //检验产品名和产品编号是否唯一
        Project checkNameProject = new Project();
        checkNameProject.setName(project.getName());
        Project checkNumberProject = new Project();
        checkNumberProject.setProjectNo(project.getProjectNo());
        if (projectMapper.getProject(checkNameProject) != null) {
            throw new ServiceException("项目名称重复");
        } else if (projectMapper.getProject(checkNumberProject) != null) {
            throw new ServiceException("项目编号重复");
        }
        List<Projectmember> projectmemberList = JSONArray.parseArray(project.getTeamReasourcesList(), Projectmember.class);
        String guid = project.getGuid();
        if (guid == null || guid.isEmpty()) {
            String createGuid = UUID.randomUUID().toString();
            project.setGuid(createGuid);
            project.setCreateTime(new Date());
            projectMapper.insertProject(project);
            projectMapper.insertProjectMember(createGuid, projectmemberList);
        } else {
            projectMapper.updateProject(project);
            for (Projectmember projectmember : projectmemberList) {
                projectMapper.updateProjectMember(guid, projectmember);
            }
        }
    }

    @Override
    public void deleteProject(String guid) {
        projectMapper.deleteProject(guid);
    }

    @Override
    public List<Producemember> listProjectMemList(String guid) {
        return projectMapper.listProjectMemList(guid);
    }
}
