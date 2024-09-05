package com.example.fastboot.common.utils.ip;

import cn.hutool.extra.spring.SpringUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.HttpUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.config.FastCommonConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.InputStreamReader;


/**
 * @author liuzhaobo
 */
@Slf4j
public class AddressUtils {


    // 太平洋IP地址查询
    public static final String IP_URL = "http://whois.pconline.com.cn/ipJson.jsp";


    public static String getRealAddressByIP(String ip) {
        FastCommonConfig fastCommonConfig = SpringUtil.getBean(FastCommonConfig.class);
        if (fastCommonConfig.isLoginAddressSwitch()) {
            try {
                HttpRequest httpRequest = HttpUtil.createGet(IP_URL + "?ip=" + ip + "&json=true");
                httpRequest.header("accept", "*/*");
                httpRequest.header("connection", "Keep-Alive");
                httpRequest.header("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                HttpResponse execute = httpRequest.execute();
                String rspStr = execute.body();
                JSONObject obj = JSON.parseObject(rspStr);
                String region = obj.getString("pro");
                String city = obj.getString("city");
                String address = String.format("%s %s", region, city);
                if (address.equals(" ")) {
                    return obj.getString("addr");
                } else {
                    return address;
                }
            } catch (Exception e) {
                log.error("获取地理位置异常 {}", ip);
                return "获取地理位置异常";
            }
        }
        return "未启用";
    }
}
