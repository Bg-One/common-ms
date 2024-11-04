package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.vo.WorkDurationVo;
import com.example.fastboot.server.sys.model.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 27 23 54
 **/
@Repository
@Mapper
public interface WorkOrderMapper {
    /**
     * 获取工单类型配置
     *
     * @return
     */
    List<Workordertype> listWorkOrderType();

    /**
     * 更新工单类型配置
     *
     * @param name
     * @param guid
     */

    void updateWorkOrderType(String name, String guid);

    /**
     * 删除工单类型配置
     *
     * @param guid
     */
    void deleteWorkOrderType(String guid);

    /**
     * 创建工单类型
     *
     * @param workordertype
     */
    void createWorkOrderType(Workordertype workordertype);

    /**
     * 获取工单类目配置
     *
     * @return
     */
    List<Workordercategory> listWorkOrderCategory(Workordercategory workordercategory);

    /**
     * 更新工单类目配置
     *
     * @param name
     * @param guid
     */
    void updateWorkOrderCategory(String name, String guid);

    /**
     * 删除工单类目配置
     *
     * @param guid
     */
    void deleteWorkOrderCategory(String guid);

    /**
     * 创建工单类目配置
     *
     * @param workordercategory
     */
    void createWorkOrderCategory(Workordercategory workordercategory);

    /**
     * 获取工单条目配置
     *
     * @return
     */
    List<Workorderitem> listWorkOrderItem(Workorderitem workorderitem);


    /**
     * 更新工单条目配置
     *
     * @param name
     * @param guid
     */
    void updateWorkOrderItem(String name, String guid);

    /**
     * 删除工单条目配置
     *
     * @param guid
     */
    void deleteWorkOrderItem(String guid);

    /**
     * 新增工单条目配置
     *
     * @param workorderitem
     */
    void createWorkOrderItem(Workorderitem workorderitem);


    /**
     * 获取员工审核关系
     *
     * @return
     */
    List<Reviewrelationship> listReviewRelationship();

    /**
     * 获取指定审核人
     *
     * @param userGuid
     * @return
     */
    String getReviewGuid(String userGuid);

    /**
     * 新增审核关系
     *
     * @param reviewrelationship
     */
    void insertReviewRelationship(Reviewrelationship reviewrelationship);

    /**
     * 更新审核关系
     *
     * @param reviewrelationship
     */
    void updateReviewRelationship(Reviewrelationship reviewrelationship);

    /**
     * 获取工单统计数据
     *
     * @param workDurationVo
     * @return
     */
    List<Workorder> listWorkOrderForWorkDuration(@Param("workDuration") WorkDurationVo workDurationVo);

    /**
     * 获取工单列表
     *
     * @param workorder
     * @return
     */
    List<Workorder> listWorkOrder(Workorder workorder);

    /**
     * 获取项目部工单类型
     *
     * @return
     */
    List<EngineeringWorkType> listProjectDepworkType();

    /**
     * 删除工单
     *
     * @param guid
     */
    void deleteWorkOrder(String guid);

    /**
     * 获取工单详情列表
     *
     * @param createGuid
     * @param createTime
     * @return
     */
    List<Workorder> listWorkOrderByCreateParam(String createGuid, String createTime);

    /**
     * 根据唯一标识列表获取工单
     *
     * @param guidList
     * @return
     */
    List<Workorder> listWorkOrderByGuidList(List<String> guidList);

    /**
     * 更新工单状态
     *
     * @param workorder
     */
    void updateWorkOrderStatus(Workorder workorder);

    /**
     * 根据用户唯一标识获取工单
     *
     * @param userGuid
     * @return
     */
    List<String> listWorkOrderGuidByUserGuid(String userGuid);

    /**
     * 更新工单
     *
     * @param workorder
     */
    void updateWorkOrder(@Param("workorder") Workorder workorder);

    /**
     * 新增工单
     *
     * @param workOrderList
     */
    void createWorkOrder(@Param("workOrderList") List<Workorder> workOrderList);

    /**
     * 获取审核人员
     * @param creatUserGuid
     * @return
     */
    SysUser getReviewUser(@Param("creatUserGuid") String creatUserGuid);

    /**
     * 根据用户唯一标识获取工单
     * @param userGuid
     * @return
     */
    List<Workorder> listWorkOrderByUserGuid(String userGuid);

    /**
     * 获取审核人工单数量
     * @param userGuid
     * @return
     */
    int listUserGuidByReviewGuid(String userGuid);
}
