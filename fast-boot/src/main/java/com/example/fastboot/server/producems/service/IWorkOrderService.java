package com.example.fastboot.server.producems.service;

import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.vo.WorkDurationVo;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 27 23 56
 **/
public interface IWorkOrderService {


    /**
     * 获取工单类型
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
     * 新增工单类型配置
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
     * 新建工单类目有配置
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
     * 删除工单配置条目
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
     * 保存任务审核关系
     *
     * @param reviewrelationshipList
     */
    void saveReviewRelationship(List<Reviewrelationship> reviewrelationshipList);

    /**
     * 按照项目统计工时
     *
     * @param workDurationVo
     * @return
     */
    List<Workorder> statisticProjectWorkDuration(WorkDurationVo workDurationVo);

    /**
     * 按照人员统计工时
     *
     * @param workDurationVo
     * @return
     */
    List<Workorder> statisticUserWorkDuration(WorkDurationVo workDurationVo);
}
