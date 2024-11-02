package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.Project;
import com.example.fastboot.server.producems.service.IProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 16 15 33
 **/
@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private IProjectService projectService;

    /**
     * 获取项目列表
     *
     * @param project
     * @return
     */
    @PostMapping("listProject")
    public Object listProject(Project project) {
        return success(projectService.listProject(project));
    }

    /**
     * 获取全部项目列表
     *
     * @return
     */
    @PostMapping("listAllProject")
    public Object listAllProject() {
        return success(projectService.listAllProject());
    }

    /**
     * 获取项目现场验收列表
     *
     * @param project
     * @return
     */
    @PostMapping("listOnsiteaAccept")
    public Object listOnsiteaAccept(Project project) {
        return success(projectService.listOnsiteaAccept(project));
    }

    /**
     * 新增项目
     *
     * @param project
     * @return
     */
    @SysLog(title = "新增项目", businessType = BusinessType.INSERT)
    @PreAuthorize("@permission.hasAnyRoles('qa:dept:user,qa:dept:manager')")
    @PostMapping("addOrEditProject")
    public Object addOrEditProject(Project project) {
        projectService.addOrEditProject(project);
        return success("成功");
    }

    /**
     * 删除项目
     *
     * @param guid
     * @return
     */
    @SysLog(title = "删除项目", businessType = BusinessType.DELETE)
    @PreAuthorize("@permission.hasAnyRoles('qa:dept:user,qa:dept:manager')")
    @PostMapping("delProject")
    public Object deleteProject(String guid) {
        projectService.deleteProject(guid);
        return success("删除成功");
    }


    /**
     * 现场验收/取消
     *
     * @param
     * @return
     */
    @PostMapping("onsiteaAccept")
    @SysLog(title = "现场验收/取消",businessType = BusinessType.UPDATE)
    public Object onsiteaAccept(Project project) {
        projectService.onsiteaAccept(project);
        return success("成功");
    }

    /**
     * 获取项目成员列表
     *
     * @param guid
     * @return
     */
    @PostMapping("listProjectMemList")
    public Object listProjectMemList(String guid) {
        return success(projectService.listProjectMemList(guid));
    }

    /**
     * 根据产品标识获取项目列表
     *
     * @param produceGuid
     * @return
     */
    @PostMapping("listProjectByProduceGuid")
    public Object listProjectByProduceGuid(String produceGuid) {
        return success(projectService.listProjectByProduceGuid(produceGuid));
    }

    /**
     * 获取当前登录人所属项目
     *
     * @param
     * @return
     */
    @PostMapping("listProjectByUserGuid")
    public Object listProjectByUserGuid() {
        List<Project> projectGuidList = projectService.listProjectByUserGuid("c038f991-daf2-43f3-b415-95b1ee13783c");
        return success(projectGuidList);
    }
}
