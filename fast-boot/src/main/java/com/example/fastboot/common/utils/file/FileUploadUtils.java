package com.example.fastboot.common.utils.file;

import cn.hutool.extra.spring.SpringUtil;
import com.example.fastboot.common.config.FastCommonConfig;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Objects;

/**
 * @Author bo
 * @Date 2024 08 13 20 30
 **/
public class FileUploadUtils {
    /**
     * 默认大小 50M
     */
    public static final long DEFAULT_MAX_SIZE = 50 * 1024 * 1024L;

    /**
     * 默认的文件名最大长度 100
     */
    public static final int DEFAULT_FILE_NAME_LENGTH = 100;

    /**
     * 根据文件路径上传
     *
     * @param baseDir 相对应用的基目录
     * @param file    上传的文件
     * @return 文件名称
     * @throws IOException
     */
    public static String upload(String baseDir, MultipartFile file) throws IOException {
        try {
            return upload(baseDir, file, MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION);
        } catch (Exception e) {
            throw new IOException(e.getMessage(), e);
        }
    }

    /**
     * 文件上传
     *
     * @param baseDir          相对应用的基目录
     * @param file             上传的文件
     * @param allowedExtension 上传文件类型
     * @return 返回上传成功的文件名
     */
    public static String upload(String baseDir, MultipartFile file, String[] allowedExtension) throws IOException {
        int fileNameLength = Objects.requireNonNull(file.getOriginalFilename()).length();
        //文件名长度限制
        if (fileNameLength > DEFAULT_FILE_NAME_LENGTH) {
            throw new ServiceException(CommonResultEnum.FILENAME_LENGTH_ERROR, String.format("文件名长度超出限制%s", DEFAULT_FILE_NAME_LENGTH));
        }
        //文件大小判断
        assertAllowed(file, allowedExtension);
        String fileName = extractFilename(file);
        String absPath = getAbsoluteFile(baseDir, fileName).getAbsolutePath();
        file.transferTo(Paths.get(absPath));
        return getPathFileName(baseDir, fileName);
    }

    /**
     * 文件大小校验
     *
     * @param file 上传的文件
     */
    public static void assertAllowed(MultipartFile file, String[] allowedExtension) {
        long size = file.getSize();
        if (size > DEFAULT_MAX_SIZE) {
            throw new ServiceException(CommonResultEnum.FILE_SIZE_ERROR, String.format("文件大小超出限制%s", DEFAULT_MAX_SIZE / 1024 / 1024));
        }
        String fileName = file.getOriginalFilename();
        String extension = getExtension(file);
        if (allowedExtension != null && !isAllowedExtension(extension, allowedExtension)) {
            if (allowedExtension == MimeTypeUtils.IMAGE_EXTENSION) {

            } else if (allowedExtension == MimeTypeUtils.FLASH_EXTENSION) {

            } else if (allowedExtension == MimeTypeUtils.MEDIA_EXTENSION) {

            } else if (allowedExtension == MimeTypeUtils.VIDEO_EXTENSION) {

            } else {
            }
        }
    }

    /**
     * 判断MIME类型是否是允许的MIME类型
     *
     * @param extension
     * @param allowedExtension
     * @return
     */
    public static boolean isAllowedExtension(String extension, String[] allowedExtension) {
        for (String str : allowedExtension) {
            if (str.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取文件名的后缀
     *
     * @param file 表单文件
     * @return 后缀名
     */
    public static String getExtension(MultipartFile file) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (StringUtils.isEmpty(extension)) {
            extension = MimeTypeUtils.getExtension(Objects.requireNonNull(file.getContentType()));
        }
        return extension;
    }

    /**
     * 编码文件名
     */
    public static String extractFilename(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String fileName = originalFilename.substring(0, originalFilename.lastIndexOf("."));
        return String.format("%s.%s", fileName + System.currentTimeMillis(), getExtension(file));
    }

    /**
     * 得到绝对路径下的文件
     *
     * @param uploadDir
     * @param fileName
     * @return
     * @throws IOException
     */
    public static File getAbsoluteFile(String uploadDir, String fileName) throws IOException {
        File desc = new File(uploadDir + File.separator + fileName);
        if (!desc.exists()) {
            File parentFile = desc.getParentFile();
            if (!parentFile.exists()) {
                parentFile.mkdirs();
            }
        }
        return desc;
    }

    /**
     * 得到文件名
     *
     * @param uploadDir
     * @param fileName
     * @return
     * @throws IOException
     */
    public static String getPathFileName(String uploadDir, String fileName) {
        FastCommonConfig fastCommonConfig = SpringUtil.getBean(FastCommonConfig.class);
        int dirLastIndex = fastCommonConfig.getProfile().length() + 1;
        String currentDir = StringUtils.substring(uploadDir, dirLastIndex);
        return Constants.RESOURCE_PREFIX + "/" + currentDir + "/" + fileName;
    }
}
