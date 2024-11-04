package com.example.fastboot.server.producems.controller;

import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.service.IWorkOrderService;
import com.example.fastboot.server.producems.vo.WorkDurationVo;
import com.example.fastboot.server.producems.vo.WorkorderCountVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
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
     * 获取工单列表
     *
     * @param workorder
     * @return
     */
    @PostMapping("listWorkOrder")
    public Object listWorkOrder(Workorder workorder) {
        List<Workorder> workorderList = workOrderService.listWorkOrder(workorder);
        return success(workorderList);
    }

    /**
     * 删除工单
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteWorkOrder")
    @SysLog(title = "工单管理", businessType = BusinessType.DELETE)
    public Object deleteWorkOrder(String guid) {
        workOrderService.deleteWorkOrder(guid);
//        WebSocket.countWorkOrderStatus();
        return success("成功");
    }

    /**
     * 获取工单详情
     *
     * @param createGuid
     * @param createTime
     * @return
     */
    @PostMapping("getWorkOrder")
    public Object getWorkOrder(String createGuid, String createTime) {
        List<Workorder> workOrderList = workOrderService.getWorkOrder(createGuid, createTime);
        return success(workOrderList);
    }

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
    @SysLog(title = "工单管理", businessType = BusinessType.UPDATE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.DELETE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.INSERT)
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
    @SysLog(title = "工单管理", businessType = BusinessType.UPDATE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.DELETE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.INSERT)
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
    @SysLog(title = "工单管理", businessType = BusinessType.UPDATE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.DELETE)
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
    @SysLog(title = "工单管理", businessType = BusinessType.INSERT)
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
    @SysLog(title = "工单管理", businessType = BusinessType.INSERT)
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

    /**
     * 获取工程部工作类型
     *
     * @return
     */
    @PostMapping("listProjectDepworkType")
    public Object listProjectDepworkType() {
        List<EngineeringWorkType> engineeringWorkTypeList = workOrderService.listProjectDepworkType();
        return success(engineeringWorkTypeList);
    }

    /**
     * 更改工单状态
     *
     * @param workorder
     * @return
     */
    @PostMapping("updateWorkOrderStatus")
    @SysLog(title = "工单管理", businessType = BusinessType.UPDATE)
    public Object updateWorkOrderStatus(Workorder workorder) {
        workOrderService.updateWorkOrderStatus(workorder);
        return success("成功");
    }

    /**
     * 提交工单
     *
     * @param workOrderList
     * @return
     */
    @PostMapping("submitWorkOrder")
    @SysLog(title = "工单管理", businessType = BusinessType.INSERT)
    public Object updateWorkOrder(String workOrderList) {
        workOrderService.submitWorkOrder(JSONArray.parseArray(workOrderList, Workorder.class));
        return success("成功");
    }

    /**
     * 统计工单数量
     *
     * @return
     */
    @PostMapping("countWorkOrderStatus")
    public Object countWorkOrderStatus() {
        WorkorderCountVo workorderCountVo = workOrderService.countWorkOrderStatus();
        return success(workorderCountVo);
    }
}
