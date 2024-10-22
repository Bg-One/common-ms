package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.Checkchangnotes;
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


    /**
     * 获取全部测试反馈列表
     *
     * @param checkfeedback
     * @return
     */
    @PostMapping("listCheckFeedback")
    public Object listCheckFeedback(Checkfeedback checkfeedback) {
        return success(softwareCheckService.listCheckFeedback(checkfeedback));
    }

    /**
     * 更新测试反馈
     *
     * @param checkFeedbackList
     * @return
     */
    @PostMapping("editCheckfeedback")
    public Object editCheckfeedback(String checkFeedbackList) {
        softwareCheckService.editCheckfeedback(checkFeedbackList);
        return success("成功");
    }
    /**
     * 新增测试反馈
     *
     * @param checkfeedback
     * @return
     */
    @PostMapping("addCheckfeedback")
    public Object addCheckfeedback(Checkfeedback checkfeedback) {
        softwareCheckService.addCheckfeedback(checkfeedback);
        return success("成功");
    }

    /**
     * 获取变更详情
     *
     * @param guid
     * @return
     */
    @PostMapping("getCheckChangeNotes")
    public Object getCheckChangeNotes(String guid) {
        return success(softwareCheckService.getCheckChangeNotes(guid));
    }

    /**
     * 新增变更说明
     *
     * @param checkchangnotes
     * @return
     */
    @PostMapping("addOrEditCheckChangNote")
    public Object addOrEditCheckChangNote(Checkchangnotes checkchangnotes) {
        softwareCheckService.addOrEditCheckChangNote(checkchangnotes);
        return success("成功");
    }
    /**
     * 新增变更说明
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteCheckFeedback")
    public Object deleteCheckFeedback(String guid) {
        softwareCheckService.deleteCheckFeedback(guid);
        return success("成功");
    }
}
