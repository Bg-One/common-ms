package com.example.fastboot.server.producems.mapper;


import com.example.fastboot.server.producems.model.Producemember;
import com.example.fastboot.server.producems.model.Project;
import com.example.fastboot.server.producems.model.Projectmember;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface ProjectMapper {

    /**
     * 根据产品唯一标识获取项目数量
     *
     * @param guid
     */
    int countByProduceGuid(String guid);

    /**
     * 获取产品列表
     *
     * @param project
     * @return
     */
    List<Project> listProject(Project project);

    /**
     * 获取项目资源列表
     *
     * @param projectGuid
     * @return
     */
    List<Projectmember> listProduceMember(String projectGuid);

    /**
     * 获取项目
     *
     * @param project
     * @return
     */
    Project getProject(Project project);

    /**
     * 新增项目
     *
     * @param project
     */
    void insertProject(Project project);

    /**
     * 更新项目
     *
     * @param project
     */
    void updateProject(Project project);

    /**
     * 新增项目资源
     *
     * @param projectGuid
     * @param projectmemberList
     */
    void insertProjectMember(@Param("projectGuid") String projectGuid, @Param("projectmemberList") List<Projectmember> projectmemberList);

    /**
     * 更新项目资源
     *
     * @param guid
     * @param projectmember
     */
    void updateProjectMember(@Param("guid") String guid, @Param("projectmember") Projectmember projectmember);

    /**
     * 删除项目
     *
     * @param guid
     */
    void deleteProject(String guid);


    /**
     * 获取项目组成员列表
     *
     * @param guid
     * @return
     */
    List<Producemember> listProjectMemList(String guid);

    /**
     * 获取现场验收列表
     *
     * @param project
     * @return
     */
    List<Project> listOnsiteaAccept(Project project);

    /**
     * 验收/取消验收
     *
     * @param project
     */
    void onsiteaAccept(Project project);

    /**
     * 根据产品标识获取项目列表
     *
     * @param produceGuid
     * @return
     */
    List<Project> listProjectByProduceGuid(String produceGuid);

    /**
     * 获取项目成员列表
     *
     * @param projectGuid
     * @param teamResourceList
     * @return
     */
    List<Projectmember> listProjectMemberByType(@Param("projectGuid") String projectGuid, @Param("teamResourceList") ArrayList<Integer> teamResourceList);

    /**
     * 获取全部产品列表
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
    List<Project> listProjectByUser(String creatUserGuid);

    /**
     * 获取用户锁定项目列表
     *
     * @param creatUserGuid
     * @return
     */
    List<String> listProjectGuidByUserGuid(String creatUserGuid);

    /**
     * 获取项目唯一标识列表
     *
     * @param produceGuidByUserGuidList
     * @return
     */
    List<String> listProjectGuidByProduceGuidList(List<String> produceGuidByUserGuidList);

    /**
     * 根据项目唯一标识获取项目列表
     *
     * @param projectGuidList
     * @return
     */
    List<Project> listProjectByProjectGuidList(ArrayList<String> projectGuidList);
}
