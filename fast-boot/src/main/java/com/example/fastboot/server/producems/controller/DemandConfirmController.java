package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IDemandService;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 16 20 53
 **/
@RestController
@RequestMapping("demandConfirm")
public class DemandConfirmController {

    @Autowired
    private IDemandService demandService;

    /**
     * 获取需求确认数量列表
     *
     * @param producemanage
     * @return
     */
    @PostMapping("countDemandConfirm")
    public Object countDemandConfirm(Producemanage producemanage) {
        return success(demandService.countDemandConfirm(producemanage));
    }

    /**
     * 查看需求确认详情列表
     *
     * @param demandConfirmDetailVo
     * @return
     */
    @PostMapping("listDemandConfirmDetail")
    public Object listDemandConfirmDetail(DemandConfirmDetailVo demandConfirmDetailVo) {
        return success(demandService.listDemandConfirmDetail(demandConfirmDetailVo));
    }

    /**
     * 修改需求确认详情
     *
     * @param demandConfirmList
     * @param demandGuid
     * @return
     */
    @PostMapping("updateDemandConfirmDetail")
    public Object updateDemandConfirmDetail(String demandConfirmList, String demandGuid, String produceGuid) {
        demandService.updateDemandConfirmDetail(demandConfirmList, demandGuid, produceGuid);
        return success("成功");
    }
}
