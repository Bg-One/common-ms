package com.example.fastboot.common.utils.file;

/**
 * @Author bo
 * @Date 2024 08 13 19 14
 **/
public class FileTypeUtils {


    /**
     * 获取文件类型
     *
     * @param fileName 文件名
     * @return 后缀（不含".")
     */
    public static String getFileType(String fileName) {
        int separatorIndex = fileName.lastIndexOf(".");
        if (separatorIndex < 0) {
            return "";
        }
        return fileName.substring(separatorIndex + 1).toLowerCase();
    }
}
