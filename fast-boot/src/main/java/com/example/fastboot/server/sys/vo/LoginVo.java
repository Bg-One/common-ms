package com.example.fastboot.server.sys.vo;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @Author bo
 * @Date 2024 07 24 11 29
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "登录信息")
public class LoginVo {
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空串")
    @NotNull(message = "用户名不能为空")
    @Max(value = 20, message = "用户名长度最大为20")
    @Min(value = 5, message = "用户名长度最小为5")
    @Schema(name = "userName", type = "String", description = "用户名")
    private String userName;

    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空串")
    @NotNull(message = "密码不能为空")
    @Max(value = 20, message = "密码长度最大为20")
    @Min(value = 5, message = "密码长度最小为5")
    @Schema(name = "password", type = "String", description = "密码")
    private String password;

    /**
     * 验证码
     */
    @Schema(name = "code", type = "String", description = "验证码")
    private String code;

    /**
     * 验证码唯一标识
     */
    @Schema(name = "uuid", type = "String", description = "验证码唯一标识")
    private String uuid;
}
