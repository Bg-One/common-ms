package com.example.fastboot.server.producems.service;

import com.example.fastboot.server.producems.model.WeeklyReport;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 11 07 14 19
 **/

public interface IWeeklyReportService {

    /**
     * 获取工作集
     *
     * @param weeklyReport
     * @return
     */
    List<WeeklyReport> listWeeklyReporterSet(WeeklyReport weeklyReport);

    /**
     * 获取工作集详情
     *
     * @param guid
     * @return
     */
    WeeklyReport getWeeklyReporterSetDetail(String guid);

    /**
     * 新增工作集
     *
     * @param weeklyReport
     */
    void addWeeklyReport(WeeklyReport weeklyReport);

    /**
     * 删除工作集
     *
     * @param guid
     */
    void delWeeklyReport(String guid);

    /**
     * 更新工作集
     * @param weeklyReport
     */
    void updateWeeklyReport(WeeklyReport weeklyReport);

    /**
     * 新增或更新工作集详情
     * @param weeklyReport
     */
    void addOrEditWeeklyReportDetail(WeeklyReport weeklyReport);

    /**
     * 删除工作及详情
     * @param guid
     */
    void delWeeklyReportDetail(String guid);
}

