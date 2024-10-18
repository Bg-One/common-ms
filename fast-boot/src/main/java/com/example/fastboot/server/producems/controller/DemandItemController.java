package com.example.fastboot.server.producems.controller;

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
}
