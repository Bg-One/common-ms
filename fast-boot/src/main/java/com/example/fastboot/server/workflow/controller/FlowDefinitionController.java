package com.example.fastboot.server.workflow.controller;


import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.server.workflow.service.IFlowDefinitionService;
import com.example.fastboot.server.workflow.vo.FlowSaveXmlVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;


@Slf4j
@RestController
@RequestMapping("/flowable/definition")
public class FlowDefinitionController {

    @Autowired
    private IFlowDefinitionService flowDefinitionService;

    /**
     * 获取流程定义列表
     *
     * @return
     */
    @PostMapping(value = "/listFlowable")
    public Object listFlowable() {
        return CommonResult.success(flowDefinitionService.list());
    }

    /**
     * 保存流程定义
     *
     * @param vo
     * @return
     */
    @PostMapping("/saveFlowable")
    public Object saveFlowable(FlowSaveXmlVo vo) {
        InputStream in = null;
        try {
            in = new ByteArrayInputStream(vo.getXml().getBytes(StandardCharsets.UTF_8));
            flowDefinitionService.importFile(vo.getName(), vo.getCategory(), in);
        } catch (Exception e) {
            log.error("导入失败:", e);
            return CommonResult.error();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException e) {
                log.error("关闭输入流出错", e);
            }
        }

        return CommonResult.success("导入成功");
    }


}
