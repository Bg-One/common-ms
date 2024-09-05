package com.example.fastboot.common.redis;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.serializer.*;

/**
 * @author 徐一杰
 * @date 2022/3/13
 * @description redis配置
 */
@SpringBootConfiguration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        //设置value的序列化方式json
        redisTemplate.setValueSerializer(redisSerializer());
        //设置key序列化方式String
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        //设置hash key序列化方式String
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        //设置hash value序列化json
        redisTemplate.setHashValueSerializer(redisSerializer());
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    public RedisSerializer<Object> redisSerializer() {
        //创建JSON序列化器
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        //必须设置，否则无法序列化实体类对象
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }

    @Bean
    public DefaultRedisScript<Long> limitScript() {
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptText(limitScriptText());
        redisScript.setResultType(Long.class);
        return redisScript;
    }

    /**
     * 限流脚本
     */
    private String limitScriptText() {
        return "redis.replicate_commands()\n" +
                "\n" +
                "-- 参数中传递的key\n" +
                "local key = KEYS[1]\n" +
                "\n" +
                "-- 令牌桶填充时间间隔\n" +
                "local refill_interval = tonumber(ARGV[1])\n" +
                "\n" +
                "-- 记录当前key上次更新令牌桶的时间的 key\n" +
                "local last_update_key = 'ratelimit_prefix' .. key\n" +
                "\n" +
                "-- 获取当前时间(秒数)\n" +
                "local current_time = tonumber(redis.call('TIME')[1])\n" +
                "\n" +
                "-- 从Redis中获取当前key对应的上次更新令牌桶的时间\n" +
                "local last_update_time = tonumber(redis.call('get', last_update_key) or 0)\n" +
                "\n" +
                "-- 获取当前key对应令牌桶中的令牌数\n" +
                "local token_count = tonumber(redis.call('get', key) or -1)\n" +
                "\n" +
                "-- 令牌桶的容量\n" +
                "local capacity = tonumber(ARGV[2])\n" +
                "\n" +
                "-- 初始化令牌桶或更新令牌\n" +
                "if token_count < 0 or last_update_time == 0 then\n" +
                "    -- 初始化令牌桶\n" +
                "    redis.call('set', last_update_key, current_time)\n" +
                "    redis.call('set', key, capacity - 1)\n" +
                "    return capacity - 1\n" +
                "else\n" +
                "    -- 检查令牌是否足够\n" +
                "    if token_count > 0 then\n" +
                "        redis.call('set', key, token_count - 1)\n" +
                "        return token_count - 1\n" +
                "    else\n" +
                "        -- 判断是否需要更新令牌\n" +
                "        if (last_update_time + refill_interval)  <= current_time then\n" +
                "            redis.call('set', key, capacity - 1)\n" +
                "            redis.call('set', last_update_key, current_time)\n" +
                "            return capacity - 1\n" +
                "        else\n" +
                "            return -1\n" +
                "        end\n" +
                "    end\n" +
                "end\n";
    }
}

