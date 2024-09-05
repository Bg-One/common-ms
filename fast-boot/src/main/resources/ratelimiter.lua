
redis.replicate_commands()

-- 参数中传递的key
local key = KEYS[1]

-- 令牌桶填充时间间隔
local refill_interval = tonumber(ARGV[1])

-- 记录当前key上次更新令牌桶的时间的 key
local last_update_key = 'ratelimit_prefix' .. key

-- 获取当前时间(秒数)
local current_time = tonumber(redis.call('TIME')[1])

-- 从Redis中获取当前key对应的上次更新令牌桶的时间
local last_update_time = tonumber(redis.call('get', last_update_key) or 0)

-- 获取当前key对应令牌桶中的令牌数
local token_count = tonumber(redis.call('get', key) or -1)

-- 令牌桶的容量
local capacity = tonumber(ARGV[2])

-- 初始化令牌桶或更新令牌
if token_count < 0 or last_update_time == 0 then
    -- 初始化令牌桶
    redis.call('set', last_update_key, current_time)
    redis.call('set', key, capacity - 1)
    return capacity - 1
else
    -- 检查令牌是否足够
    if token_count > 0 then
        redis.call('set', key, token_count - 1)
        return token_count - 1
    else
        -- 判断是否需要更新令牌
        if (last_update_time + refill_interval)  <= current_time then
            redis.call('set', key, capacity - 1)
            redis.call('set', last_update_key, current_time)
            return capacity - 1
        else
            return -1
        end
    end
end
