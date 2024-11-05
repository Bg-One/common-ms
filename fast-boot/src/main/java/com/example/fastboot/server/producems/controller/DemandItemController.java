package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.DemandItem;
import com.example.fastboot.server.producems.model.Detaileddesign;
import com.example.fastboot.server.producems.model.Nodes;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 18 16 25
 **/
@RestController
@RequestMapping("/demandItem")
public class DemandItemController {

    @Autowired
    private IDemandService demandService;

    /**
     * 获取全部的需求节点
     *
     * @param nodes
     * @return
     */
    @PostMapping("listNodes")
    public Object listNodes(Nodes nodes) {
        return success(demandService.listNodes(nodes));
    }

    /**
     * 根据项目获取全部的需求节点
     *
     * @param projectGuid
     * @return
     */
    @PostMapping("listNodesByProject")
    public Object listNodesByProject(String projectGuid) {
        return success(demandService.listNodesByProject(projectGuid));
    }

    /**
     * 获取需求信息
     *
     * @param guid
     * @return
     */
    @PostMapping("getNodes")
    public Object getNodes(String guid) {
        return success(demandService.getNodes(guid));
    }

    /**
     * 获取软件详细设计
     *
     * @param nodeGuid
     * @return
     */
    @PostMapping("getDetailDesign")
    public Object getDetailDesign(String nodeGuid) {
        return success(demandService.getDetailDesign(nodeGuid));
    }

    /**
     * 新增或修改详细设计
     *
     * @param detaileddesign
     * @return
     */
    @PostMapping("addOrEditDetailDesign")
    @PreAuthorize("@permission.hasAnyRoles('rd:dept:user,rd:dept:manager')")
    @SysLog(title = "需求描述管理", businessType = BusinessType.UPDATE)
    public Object addOrEditDetailDesign(Detaileddesign detaileddesign) {
        demandService.addOrEditDetailDesign(detaileddesign);
        return success("成功");
    }

    /**
     * 新增或更新需求分项
     *
     * @param demanditem
     * @return
     */
    @PostMapping("addOrEditDemandItem")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求描述管理", businessType = BusinessType.UPDATE)
    public Object addOrEditDemandItem(DemandItem demanditem) {
        demandService.addOrEditDemandItem(demanditem);
        return success("成功");
    }

    @PostMapping("addNodes")
    @SysLog(title = "需求描述管理", businessType = BusinessType.INSERT)
    @PreAuthorize("@permission.hasAnyRoles('rd:dept:user,rd:dept:manager')")
    public Object addNodes(Nodes nodes) {
        demandService.addNodes(nodes);
        return success("成功");
    }

    @PostMapping("editNodes")
    @SysLog(title = "需求描述管理", businessType = BusinessType.UPDATE)
    @PreAuthorize("@permission.hasAnyRoles('rd:dept:user,rd:dept:manager')")
    public Object editNodes(String guid, String nodeName) {
        demandService.editNodes(guid, nodeName);
        return success("成功");
    }

    @PreAuthorize("@permission.hasAnyRoles('rd:dept:user,rd:dept:manager')")
    @PostMapping("deleteNodes")
    @SysLog(title = "需求描述管理", businessType = BusinessType.DELETE)
    public Object deleteNodes(String guid) {
        demandService.deleteNodes(guid);
        return success("成功");
    }
}
