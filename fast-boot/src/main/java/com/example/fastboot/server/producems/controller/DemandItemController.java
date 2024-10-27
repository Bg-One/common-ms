package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.DemandItem;
import com.example.fastboot.server.producems.model.Detaileddesign;
import com.example.fastboot.server.producems.model.Nodes;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IDemandService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Object addOrEditDemandItem(DemandItem demanditem) {
        demandService.addOrEditDemandItem(demanditem);
        return success("成功");
    }
}
