package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.Demandtrace;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IDemandService;
import liquibase.pro.packaged.S;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 22 16 19
 **/
@RestController
@RequestMapping("demandTrace")
public class DemandTraceController {

    @Autowired
    private IDemandService demandService;

    /**
     * 统计需求跟踪数量
     *
     * @param producemanage
     * @return
     */
    @PostMapping("countDemandTraceByProduce")
    public Object countDemandTraceByProduce(Producemanage producemanage) {
        return success(demandService.countDemandTraceByProduce(producemanage));
    }

    /**
     * 关联产品
     *
     * @param produceGuid
     * @return
     */
    @PostMapping("relatedProduce")
    @PreAuthorize("@permission.hasAnyRoles('pro:dept:user,pro:dept:manager')")
    @SysLog(title = "需求跟踪管理", businessType = BusinessType.INSERT)
    public Object relatedProduce(String produceGuid) {
        demandService.relatedProduce(produceGuid);
        return success("成功");
    }

    /**
     * 获取需求跟踪详情列表
     *
     * @param demandtrace
     * @return
     */
    @PostMapping("listDemandTrace")
    public Object listDemandTrace(Demandtrace demandtrace) {
        return success(demandService.listDemandTrace(demandtrace));
    }

    /**
     * 更新需求变更详细描述
     *
     * @param guid
     * @param detailDescription
     * @return
     */
    @PostMapping("updateDemandTraceDetailDes")
    @SysLog(title = "需求跟踪管理", businessType = BusinessType.UPDATE)
    public Object updateDemandTraceDetailDes(String guid, String detailDescription) {
        demandService.updateDemandTraceDetailDes(guid, detailDescription);
        return success("成功");
    }

    /**
     * 删除需求跟踪记录
     *
     * @param guid
     * @return
     */
    @PostMapping("deleteteDemandTrace")
    @SysLog(title = "需求跟踪管理", businessType = BusinessType.DELETE)
    public Object deleteteDemandTrace(String guid) {
        demandService.deleteteDemandTrace(guid);
        return success("成功");
    }

    /**
     * 新增需求跟踪记录
     *
     * @param demandtrace
     * @return
     */
    @PostMapping("addDemandTrace")
    @SysLog(title = "需求跟踪管理", businessType = BusinessType.INSERT)
    public Object addDemandTrace(Demandtrace demandtrace) {
        demandService.addDemandTrace(demandtrace);
        return success("成功");
    }

    /**
     * 更新需求跟踪
     *
     * @param demandTraceList
     * @return
     */
    @PostMapping("editDemandTrace")
    @SysLog(title = "需求跟踪管理", businessType = BusinessType.UPDATE)
    public Object editDemandTrace(String demandTraceList) {
        demandService.editDemandTrace(demandTraceList);
        return success("成功");
    }
}
