package com.vision_x.vision_x.service;

import com.vision_x.vision_x.entity.Member;
import com.vision_x.vision_x.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private MemberRepository memberRepository;  // 사용자의 정보를 가져오는 JPA Repository

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 데이터베이스에서 사용자 정보 조회
        Optional<Member> memberOptional = memberRepository.findByMemId(username);

        if (!memberOptional.isPresent()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        Member member = memberOptional.get();

        // Spring Security의 UserDetails 객체를 반환
        return new org.springframework.security.core.userdetails.User(
                member.getMemId(),
                member.getMemPassword(),  // 이미 암호화된 비밀번호를 넣음
                new ArrayList<>()  // 권한 목록을 빈 리스트로 설정 (필요한 경우 권한 추가)
        );
    }
}

