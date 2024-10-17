package com.vision_x.vision_x.security;

import org.springframework.security.crypto.password.PasswordEncoder;

public class PlainTextPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        // 인코딩 없이 비밀번호 반환 (암호화 생략)
        return rawPassword.toString();
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // 암호화된 비밀번호와 비교 (암호화 생략)
        return rawPassword.toString().equals(encodedPassword);
    }
}
