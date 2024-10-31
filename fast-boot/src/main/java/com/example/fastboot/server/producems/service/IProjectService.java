package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.Producemember;
import com.example.fastboot.server.producems.model.Project;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 16 15 36
 **/
public interface IProjectService {


    /**
     * 获取项目列表
     *
     * @param project
     * @return
     */
    PageResponse listProject(Project project);

    /**
     * 新增或者更新项目
     *
     * @param project
     */
    void addOrEditProject(Project project);

    /**
     * 删除项目
     *
     * @param guid
     */
    void deleteProject(String guid);

    /**
     * 获取项目成员列表
     *
     * @param guid
     * @return
     */
    List<Producemember> listProjectMemList(String guid);

    /**
     * 获取出厂验收列表
     *
     * @param project
     * @return
     */
    PageResponse listOnsiteaAccept(Project project);

    /**
     * 验收/取消验收
     *
     * @param project
     */
    void onsiteaAccept(Project project);

    /**
     * 根据项目guid获取项目信息
     *
     * @param produceGuid
     * @return
     */
    List<Project> listProjectByProduceGuid(String produceGuid);

    /**
     * 获取全部项目列表
     *
     * @return
     */
    List<Project> listAllProject();


    /**
     * 获取用户相关的项目列表
     *
     * @param creatUserGuid
     * @return
     */
    List<Project> listProjectByUserGuid(String creatUserGuid);
}
