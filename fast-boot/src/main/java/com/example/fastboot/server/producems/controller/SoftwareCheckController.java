package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.Checkfeedback;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.ISoftwareCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 18 08 55
 **/
@RestController
@RequestMapping("/softwareCheck")
public class SoftwareCheckController {

    @Autowired
    private ISoftwareCheckService softwareCheckService;

    /**
     * 获取软件测试数量列表
     *
     * @param producemanage
     * @return
     */
    @PostMapping("countCheckFeedbackByProduce")
    public Object countCheckFeedbackByProduce(Producemanage producemanage) {
        return success(softwareCheckService.countCheckFeedbackByProduce(producemanage));
    }

    /**
     * 关联产品
     *
     * @param produceGuid
     * @return
     */
    @PostMapping("relatedProduce")
    public Object relatedProduce(String produceGuid) {
        softwareCheckService.relatedProduce(produceGuid);
        return success("成功");
    }


    @PostMapping("listCheckFeedback")
    public Object listCheckFeedback(Checkfeedback checkfeedback) {
        return success(softwareCheckService.listCheckFeedback(checkfeedback));
    }
}
