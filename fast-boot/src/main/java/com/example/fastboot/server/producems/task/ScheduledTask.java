package com.example.fastboot.server.producems.task;


import com.example.fastboot.server.producems.service.IAlertService;
import com.example.fastboot.server.producems.service.IWorkOrderService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;


@Slf4j
@Component
public class ScheduledTask {

    private final SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
    @Autowired
    private IAlertService alertService;
    @Autowired
    private IWorkOrderService workOrderService;


    @Scheduled(cron = "0 5 0 * * ? ")  // 每天零点五分执行
    public void onStart() {
        //获取当前时间往前推7天的时间小于该时间的工单
//
//        DateTime date = DateUtil.date();
//        DateTime offset = DateUtil.offset(date, DateField.DAY_OF_MONTH, -7);
//        //获取部门经理的人员
//        List<Workorder> workOrderList = workOrderService.listAllUnauditedManagerWorkOrder();

    }

}
