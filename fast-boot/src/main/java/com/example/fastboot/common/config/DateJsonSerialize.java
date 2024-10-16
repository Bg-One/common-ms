package com.example.fastboot.common.config;

import cn.hutool.core.date.DateUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.Date;


/**
 * @author liuzhaobo
 */
public class DateJsonSerialize extends JsonSerializer<Date> {

    //重写serialize方法
    @Override
    public void serialize(Date date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        if ("1970-01-01 00:00:00".equals(DateUtil.format(date, "yyyy-MM-dd HH:mm:ss"))) {
            //自定义处理方式
            jsonGenerator.writeString("");
        } else {
            jsonGenerator.writeString(DateUtil.format(date, "yyyy-MM-dd HH:mm:ss"));
        }
    }
}
