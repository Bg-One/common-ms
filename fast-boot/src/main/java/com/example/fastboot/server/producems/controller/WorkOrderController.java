package com.example.fastboot.server.producems.controller;

import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.service.IWorkOrderService;
import com.example.fastboot.server.producems.vo.WorkDurationVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 27 23 40
 **/
@RestController
@RequestMapping("/workOrder")
public class WorkOrderController {

    @Autowired
    private IWorkOrderService workOrderService;

    /**
     * 获取工单类型配置列表
     *
     * @return
     */
    @PostMapping("listWorkOrderType")
    public Object listWorkOrderType() {
        List<Workordertype> workordertypeList = workOrderService.listWorkOrderType();
        return success(workordertypeList);
    }

    /**
     * 更新工单类型配置
     *
     * @param name
     * @param guid
     * @return
     */
    @PostMapping("updateWorkOrderType")
    public Object updateWorkOrderType(String name, String guid) {
        workOrderService.updateWorkOrderType(name, guid);
        return success("成功");
    }


    /**
     * 删除工单类型配置
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteWorkOrderType")
    public Object deleteWorkOrderType(String guid) {
        workOrderService.deleteWorkOrderType(guid);
        return success("成功");
    }

    /**
     * 新建工单类型配置
     *
     * @param workordertype
     * @return
     */
    @PostMapping("createWorkOrderType")
    public Object createWorkOrderType(Workordertype workordertype) {
        workOrderService.createWorkOrderType(workordertype);
        return success("成功");
    }


    /**
     * 获取工单类目配置
     *
     * @return
     */
    @PostMapping("listWorkOrderCategory")
    public Object listWorkOrderCategory(Workordercategory workordercategory) {
        List<Workordercategory> workordercategoryList = workOrderService.listWorkOrderCategory(workordercategory);
        return success(workordercategoryList);
    }

    /**
     * 更新工单类目配置
     *
     * @param name
     * @param guid
     * @return
     */
    @PostMapping("updateWorkOrderCategory")
    public Object updateWorkOrderCategory(String name, String guid) {
        workOrderService.updateWorkOrderCategory(name, guid);
        return success("成功");
    }


    /**
     * 删除工单类目配置
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteWorkOrderCategory")
    public Object deleteWorkOrderCategory(String guid) {
        workOrderService.deleteWorkOrderCategory(guid);
        return success("成功");
    }

    /**
     * 新建工单类目配置
     *
     * @param workordercategory
     * @return
     */
    @PostMapping("createWorkOrderCategory")
    public Object createWorkOrderCategory(Workordercategory workordercategory) {
        workOrderService.createWorkOrderCategory(workordercategory);
        return success("成功");
    }

    /**
     * 获取工单条目配置
     *
     * @return
     */
    @PostMapping("listWorkOrderItem")
    public Object listWorkOrderItem(Workorderitem workorderitem) {
        List<Workorderitem> workorderitemList = workOrderService.listWorkOrderItem(workorderitem);
        return success(workorderitemList);
    }

    /**
     * 更新工单条目配置
     *
     * @param name
     * @param guid
     * @return
     */
    @PostMapping("updateWorkOrderItem")
    public Object updateWorkOrderItem(String name, String guid) {
        workOrderService.updateWorkOrderItem(name, guid);
        return success("成功");
    }

    /**
     * 删除工单条目配置
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteWorkOrderItem")
    public Object deleteWorkOrderItem(String guid) {
        workOrderService.deleteWorkOrderItem(guid);
        return success("成功");
    }

    /**
     * 新建工单条目配置
     *
     * @param workorderitem
     * @return
     */
    @PostMapping("createWorkOrderItem")
    public Object createWorkOrderItem(Workorderitem workorderitem) {
        workOrderService.createWorkOrderItem(workorderitem);
        return success("成功");
    }

    /**
     * 获取人员审核关系列表
     *
     * @return
     */
    @PostMapping("listReviewRelationship")
    public Object listReviewRelationship() {
        return success(workOrderService.listReviewRelationship());
    }


    /**
     * 保存人物审核关系
     *
     * @param relationshipList
     * @return
     */
    @PostMapping("saveReviewRelationship")
    public Object saveReviewRelationship(String relationshipList) {
        List<Reviewrelationship> reviewrelationshipList = JSONArray.parseArray(relationshipList, Reviewrelationship.class);
        workOrderService.saveReviewRelationship(reviewrelationshipList);
        return success("成功");
    }

    /**
     * 按照项目统计工时
     *
     * @param workDurationVo
     * @return
     */
    @PostMapping("statisticProjectWorkDuration")
    public Object statisticProjectWorkDuration(WorkDurationVo workDurationVo) {
        List<Workorder> workorderList = workOrderService.statisticProjectWorkDuration(workDurationVo);
        return success(workorderList);
    }

    /**
     * 按照人员统计工时
     *
     * @param workDurationVo
     * @return
     */
    @PostMapping("statisticUserWorkDuration")
    public Object statisticUserWorkDuration(WorkDurationVo workDurationVo) {
        List<Workorder> workorderList = workOrderService.statisticUserWorkDuration(workDurationVo);
        return success(workorderList);
    }
}
