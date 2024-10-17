package com.vision_x.vision_x.config;


import com.vision_x.vision_x.security.PlainTextPasswordEncoder;
import com.vision_x.vision_x.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;


    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF 비활성화 및 AJAX 요청을 허용하기 위해 CSRF 토큰 비활성화
        http.csrf().disable()
                .authorizeHttpRequests((requests) -> requests
                        .antMatchers("/static/**",      // 정적 리소스 허용
                                "/css/**",         // CSS 파일 허용
                                "/js/**",          // JS 파일 허용
                                "/images/**",      // 이미지 파일 허용
                                "/popup/**",       // 팝업 HTML 파일 허용
                                "/home.html",      // home 페이지 허용
                                "/assets/vendor/libs/**",
                                "/",               // 메인 페이지 허용
                                "/signIn_popup",   // 로그인 팝업 허용
                                "/signUp_popup",   // 회원가입 팝업 허용
                                "/contact_popup",//연락처 팝업 허용
                                "/ide.do",
                                "/token"
                        )
                        .permitAll()  // 리소스 및 로그인은 권한 없이 접근 가능
                        .anyRequest().authenticated()

                )
                .formLogin(formLoginSpec -> formLoginSpec
                        .loginPage("/")  // 커스텀 로그인 페이지 설정
                        .loginProcessingUrl("/login")  // 로그인 form의 action URL
                        .usernameParameter("memId")  // 로그인 폼의 사용자 ID 필드
                        .passwordParameter("memPassword")  // 로그인 폼의 비밀번호 필드
                        .failureUrl("/")
                        .defaultSuccessUrl("/", true)  // 로그인 성공 시 리다이렉트할 URL
                        .permitAll()
                )
                .logout((logout) -> logout
                        .logoutUrl("/logout")  // 로그아웃 URL
                        .logoutSuccessUrl("/")  // 로그아웃 성공 후 리다이렉트할 URL
                        .permitAll()
                )
                .sessionManagement()
                .sessionFixation()
                .none();


        return http.build();
    }

    // AuthenticationManager에 사용자 정의 UserDetailsService를 설정
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(new PlainTextPasswordEncoder())
                .and()
                .build();
    }

    // 비밀번호 암호화 방식 설정 (프론트에서 이미 해시된 비밀번호를 보냄)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();  // 암호화 사용하지 않음
    }


}


