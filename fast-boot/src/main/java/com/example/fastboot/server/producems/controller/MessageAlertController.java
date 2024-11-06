package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.MessageToPerson;
import com.example.fastboot.server.producems.service.IMessageService;
import com.example.fastboot.server.sys.controller.Base;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 11 05 16 31
 **/
@RestController
@RequestMapping("message")
public class MessageAlertController {

    @Autowired
    private IMessageService messageService;

    /**
     * 获取消息提醒列表
     *
     * @return
     */
    @PostMapping("listMessageAlerts")
    public Object listMessageAlerts(MessageToPerson messageToPerson) {
        String creatUserGuid = Base.getCreatUserGuid();
        return success(messageService.listMessageAlerts(messageToPerson,creatUserGuid));
    }


    @PostMapping("updateMessageReadFalg")
    @SysLog(title = "消息提醒管理", businessType = BusinessType.UPDATE)
    public Object updateMessageReadFalg(String messageGuid) {
        String creatUserGuid = Base.getCreatUserGuid();
        messageService.updateMessageReadFlag(creatUserGuid,messageGuid);
        return success("已更新");
    }
}
