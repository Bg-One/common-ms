package com.example.fastboot.common.response;


import org.slf4j.Logger;

/**
 * @author liuzhaobo
 */
public class CommonFun {
    public static String getExceptionTraceInfo(Exception e) {
        StringBuilder traceInfo = new StringBuilder(e.getStackTrace().toString() + "\n 具体堆栈：");
        for (int i = 0; i < e.getStackTrace().length; ++i) {
            String errorItemStr = e.getStackTrace()[i].toString();
            if (errorItemStr.startsWith("sun.") || errorItemStr.startsWith("org.") ||
                    errorItemStr.startsWith("java.") || errorItemStr.startsWith("javax.")) {
                continue;
            }
            traceInfo.append("\n");
            traceInfo.append(errorItemStr);
        }
        return traceInfo.toString();
    }
    public static  void outputException(Exception e, Logger log){
        log.error(CommonFun.getExceptionTraceInfo(e));
    }
}
