package com.example.fastboot.server.producems.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IProduceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.fastboot.common.response.CommonResult.success;

/**
 * @Author bo
 * @Date 2024 10 15 10 50
 **/
@RestController
@RequestMapping("/produce")
public class ProduceController {

    @Autowired
    private IProduceService producemanageService;

    /**
     * 获取产品列表
     *
     * @param producemanage
     * @return
     */
    @PreAuthorize("@permission.hasAuthority('producems:produce:list')")
    @PostMapping("listProduce")
    public Object listProduce(Producemanage producemanage) {
        return success(producemanageService.listProduce(producemanage));
    }

    /**
     * 获取产品列表
     *
     * @return
     */
    @PostMapping("listAllProduce")
    public Object listAllProduce() {
        return success(producemanageService.listAllProduce());
    }

    /**
     * 新增产品
     *
     * @param producemanage
     * @return
     */
    @PreAuthorize("@permission.hasAuthority('producems:produce:add')")
    @SysLog(title = "新增产品", businessType = BusinessType.INSERT)
    @PostMapping("addProduce")
    public Object addProduce(Producemanage producemanage) {
        producemanageService.addProduce(producemanage);
        return success("成功");
    }

    /**
     * 删除产品
     *
     * @param guid
     * @return
     */
    @PreAuthorize("@permission.hasAuthority('producems:produce:del')")
    @SysLog(title = "删除产品", businessType = BusinessType.DELETE)
    @PostMapping("deleteProduce")
    public Object deleteProduce(String guid) {
        producemanageService.deleteProduce(guid);
        return success("成功");
    }

    /**
     * 获取产品成员列表
     *
     * @param guid
     * @return
     */
    @PostMapping("listProduceMemList")
    public Object listProduceMemList(String guid) {
        return success(producemanageService.listProduceMemList(guid));
    }

    /**
     * 新增项目锁定关系
     *
     * @param produceGuids
     * @return
     */
    @SysLog(title = "新增项目锁定关系", businessType = BusinessType.INSERT)
    @PostMapping("updateLockProduceToUser")
    public Object updateLockProduceToUser(String[] produceGuids) {
        producemanageService.updateLockProduceToUser(produceGuids);
        return success("成功");
    }

}
