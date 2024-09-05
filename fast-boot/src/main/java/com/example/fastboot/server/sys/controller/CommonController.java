package com.example.fastboot.server.sys.controller;


import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.aspectj.annotation.RateLimiter;
import com.example.fastboot.common.config.FastCommonConfig;
import com.example.fastboot.common.config.ServerConfig;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.common.utils.file.FileUploadUtils;
import com.example.fastboot.common.utils.file.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


/**
 * @author liuzhaobo
 */
@RestController
@RequestMapping("/common")
public class CommonController {

    @Autowired
    private ServerConfig serverConfig;
    @Autowired
    private FastCommonConfig fastCommonConfig;


    /**
     * 通用下载请求
     *
     * @param fileName 文件名称
     */
    @PostMapping("/download")
    public void fileDownload(String fileName, HttpServletResponse response) throws Exception {
        if (!FileUtils.checkAllowDownload(fileName)) {
            throw new ServiceException(CommonResultEnum.FILE_DOWNLOAD_DISABLE);
        }
        String filePath = fastCommonConfig.getDownloadPath() + fileName;
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        FileUtils.setAttachmentResponseHeader(response, fileName);
        FileUtils.writeBytes(filePath, response.getOutputStream());
    }

    /**
     * 通用上传请求（多个）
     */
    @PostMapping("/uploads")
    @RateLimiter(count = 2, time = 10)
    public Object uploadFiles(List<MultipartFile> files) throws Exception {
        // 上传文件路径
        String filePath = fastCommonConfig.getUploadPath();
        JSONArray jsonArray = new JSONArray();
        for (MultipartFile file : files) {
            // 上传并返回新文件名称
            JSONObject jsonObject = new JSONObject();
            String fileName = FileUploadUtils.upload(filePath, file);
            String url = serverConfig.getUrl() + fileName;
            jsonObject.put("url", url);
            jsonObject.put("fileName", fileName);
            jsonArray.add(jsonObject);
        }
        return CommonResult.success(jsonArray);
    }

    /**
     * 本地资源通用下载(网络地址)
     */
    @PostMapping("/download/resource")
    public void resourceDownload(String resource, HttpServletResponse response) throws Exception {
        if (!FileUtils.checkAllowDownload(resource)) {
            throw new ServiceException(CommonResultEnum.FILE_DOWNLOAD_DISABLE);
        }
        // 本地资源路径
        String localPath = fastCommonConfig.getProfile();
        // 数据库资源地址
        String downloadPath = localPath + StringUtils.substringAfter(resource, Constants.RESOURCE_PREFIX);
        // 下载名称
        String downloadName = StringUtils.substringAfterLast(downloadPath, "/");
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        FileUtils.setAttachmentResponseHeader(response, downloadName);
        FileUtils.writeBytes(downloadPath, response.getOutputStream());
    }
}
