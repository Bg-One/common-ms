package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.Reviewrelationship;
import com.example.fastboot.server.producems.model.Workordercategory;
import com.example.fastboot.server.producems.model.Workorderitem;
import com.example.fastboot.server.producems.model.Workordertype;
import org.apache.ibatis.annotations.Mapper;
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
    void updateWorkOrderItemderItem(String name, String guid);

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
}
