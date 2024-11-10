package com.example.fastboot.server.producems.controller;

import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.model.WeeklyReport;
import com.example.fastboot.server.producems.service.IWeeklyReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 11 07 14 07
 **/
@RestController
@RequestMapping("/weekly")
public class WeeklyReportController {

    @Autowired
    private IWeeklyReportService weeklyReportService;

    /**
     * 获取周报工作集
     *
     * @param weeklyReport
     * @return
     */
    @PostMapping("listWeeklyReporterSet")
    public Object listWeeklyReporterSet(WeeklyReport weeklyReport) {
        return success(weeklyReportService.listWeeklyReporterSet(weeklyReport));
    }

    /**
     * 获取工作集详情
     *
     * @param guid
     * @return
     */
    @PostMapping("getWeeklyReporterSetDetail")
    public Object getWeeklyReporterSetDetail(String guid) {
        return success(weeklyReportService.getWeeklyReporterSetDetail(guid));
    }

    /**
     * 新增工作集
     */
    @PostMapping("addWeeklyReport")
    public Object addWeeklyReport(WeeklyReport weeklyReport) {
        weeklyReportService.addWeeklyReport(weeklyReport);
        return success("成功");
    }

    /**
     * 删除工作集
     */
    @PostMapping("delWeeklyReport")
    public Object delWeeklyReport(String guid) {
        weeklyReportService.delWeeklyReport(guid);
        return success("成功");
    }

    /**
     * 更新工作集
     */
    @PostMapping("updateWeeklyReport")
    public Object updateWeeklyReport(WeeklyReport weeklyReport) {
        weeklyReportService.updateWeeklyReport(weeklyReport);
        return success("成功");
    }

    /**
     * 新增或编辑工作集详情
     */
    @PostMapping("addOrEditWeeklyReportDetail")
    public Object addOrEditWeeklyReportDetail(WeeklyReport weeklyReport) {
        weeklyReportService.addOrEditWeeklyReportDetail(weeklyReport);
        return success("成功");
    }

    /**
     * 删除工作集详情
     */
    @PostMapping("delWeeklyReportDetail")
    public Object delWeeklyReportDetail(String guid) {
        weeklyReportService.delWeeklyReportDetail(guid);
        return success("成功");
    }
}
