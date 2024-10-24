package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.Demandmanage;
import com.example.fastboot.server.producems.model.Nodes;
import com.example.fastboot.server.producems.service.IDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 24 13 47
 **/
@RestController
@RequestMapping("demand")
public class DemandController {

    @Autowired
    private IDemandService demandService;


    /**
     * 获取需求数量
     */
    @PostMapping("countStatusDemand")
    public Object countStatusDemand() {
        return success(demandService.countStatusDemand());
    }

    /**
     * 获取全部的需求信息
     */
    @PostMapping("listDemand")
    public Object listDemand(Demandmanage demandmanage) {
        return success(demandService.listDemand(demandmanage));
    }

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
     * 更新需求信息
     *
     * @param demandmanage
     * @return
     */
    @PostMapping("updateDemand")
    public Object updateDemand(Demandmanage demandmanage) {
        demandService.updateDemand(demandmanage);
        return success("成功");
    }

    /**
     * 需求流转
     *
     * @param guids
     * @param staus
     * @return
     * @throws ParseException
     */
    @PostMapping("statusTransfer")
    public Object statusTransfer(String[] guids, int staus) {
        demandService.statusTransfer(guids, staus);
        return success("成功");
    }

    /**
     * 删除需求
     *
     * @param guids
     * @return
     */
    @PostMapping("deleteDemand")
    public Object deleteDemand(String[] guids) {
        demandService.deleteDemand(guids);
        return success("成功");
    }

    /**
     * 新增需求
     *
     * @param produceGuid
     * @return
     */
    @PostMapping("addDemand")
    public Object addDemand(String produceGuid) {
        demandService.addDemand(produceGuid);
        return success("成功");
    }

    @PostMapping("listDemandChangeRecord")
    public Object listDemandChangeRecord(String demandGuid) {
        return success(demandService.listDemandChangeRecord(demandGuid));
    }
}
