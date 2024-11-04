package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.Demandmanage;
import com.example.fastboot.server.producems.service.IDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
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
@Validated
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
     * 获取需求信息
     */
    @PostMapping("getDemand")
    public Object getDemand(String guid) {
        return success(demandService.getDemand(guid));
    }


    /**
     * 更新需求信息
     *
     * @param demandmanage
     * @return
     */
    @PostMapping("updateDemand")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.UPDATE)
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
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.UPDATE)
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
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.DELETE)
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
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.INSERT)
    public Object addDemand(String produceGuid) {
        demandService.addDemand(produceGuid);
        return success("成功");
    }

    /**
     * 获取需求变更记录
     *
     * @param demandGuid
     * @return
     */
    @PostMapping("listDemandChangeRecord")
    public Object listDemandChangeRecord(String demandGuid) {
        return success(demandService.listDemandChangeRecord(demandGuid));
    }

    /**
     * 获取需求术语
     *
     * @param demandGuid
     * @return
     */
    @PostMapping("listDemandTerm")
    public Object listDemandTerm(String demandGuid) {
        return success(demandService.listDemandTerm(demandGuid));
    }

    /**
     * 新增或编辑需求术语
     *
     * @param demandTermList
     * @return
     */
    @PostMapping("addOrEditDemandTerm")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.UPDATE)
    public Object addOrEditDemandTerm(String demandTermList) {
        demandService.addOrEditDemandTerm(demandTermList);
        return success("成功");
    }

    /**
     * 删除需求术语
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteDemandTerm")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.DELETE)
    public Object deleteDemandTerm(String guid) {
        demandService.deleteDemandTerm(guid);
        return success("成功");
    }

    /**
     * 获取待确认问题列表
     *
     * @param guid
     * @return
     */
    @PostMapping("listIssuesToBeConfirmed")
    public Object listIssuesToBeConfirmed(String guid) {
        return success(demandService.listIssuesToBeConfirmed(guid));
    }

    /**
     * 新增或更新待确认问题列表
     *
     * @param issuesToConfirmList
     * @return
     */
    @PostMapping("addOrEditIssuesToConfirm")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.UPDATE)
    public Object addOrEditIssuesToConfirm(String issuesToConfirmList) {
        demandService.addOrEditIssuesToConfirm(issuesToConfirmList);
        return success("成功");
    }

    /**
     * 删除待确认问题列表
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteIssuesToBeConfirmed")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求管理", businessType = BusinessType.DELETE)
    public Object deleteIssuesToBeConfirmed(String guid) {
        demandService.deleteIssuesToBeConfirmed(guid);
        return success("成功");
    }


}
