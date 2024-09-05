package com.example.fastboot.server.sys.controller;


import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.ShearCaptcha;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.config.FastCommonConfig;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.redis.RedisCache;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.server.sys.service.ISysConfigService;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static com.example.fastboot.common.constant.CacheConstants.CAPTCHA_CODE_KEY;


/**
 * @author liuzhaobo
 */
@RestController
public class CaptchaController {
    @Autowired
    private RedisCache redisCache;

    @Autowired
    private ISysConfigService iSysConfigService;

    /**
     * 生成验证码
     */
    @PostMapping("/captchaImage")
    public Object getCode(HttpServletResponse response) throws IOException {
        boolean captchaEnabled = iSysConfigService.isCaptchaEnabled();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("captchaEnabled", captchaEnabled);
        if (!captchaEnabled) {
            return CommonResult.success(jsonObject);
        }
        // 定义图形验证码的长、宽、验证码字符数、干扰线宽度
        ShearCaptcha captcha = CaptchaUtil.createShearCaptcha(150, 40, 4, 2);
        ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
        captcha.write(byteArray);
        // 获取验证码中的文字内容
        String verifyCode = captcha.getCode();
        String uuid = UUID.randomUUID().toString();
        String verifyKey = CAPTCHA_CODE_KEY + uuid;

        byte[] image = byteArray.toByteArray();
        String base64String = Base64.encodeBase64String(image);
        jsonObject.put("uuid", uuid);
        jsonObject.put("img", base64String);
        redisCache.setCacheObject(verifyKey, verifyCode, Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        return CommonResult.success(jsonObject);
    }
}
