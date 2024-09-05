package com.example.fastboot.common.security;


import org.bouncycastle.crypto.digests.SM3Digest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;


/**
 * @author liuzhaobo
 */
public class SM3PasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        if (rawPassword == null) {
            throw new IllegalArgumentException("rawPassword cannot be null");
        }

        byte[] passwordBytes = rawPassword.toString().getBytes(StandardCharsets.UTF_8);
        byte[] hash = new byte[32];
        SM3Digest sm3 = new SM3Digest();
        sm3.update(passwordBytes, 0, passwordBytes.length);
        sm3.doFinal(hash, 0);
        return bytesToHexString(hash);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return rawPassword.equals(encodedPassword);
    }

    private String bytesToHexString(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
