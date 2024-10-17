package com.vision_x.vision_x.service;

import com.vision_x.vision_x.entity.Member;
import com.vision_x.vision_x.repository.MemberRepository;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;
    /*@Setter
    @Getter
    @Value("${cipher.aes256.key}")*/
    private String aes256Key ="digitaltwin";


    private String key = new java.math.BigInteger(aes256Key.getBytes()).toString(2).substring(0, 16);


    // 회원가입 처리
    public void registerMember(String memId, String memName, String memEmail, String rawPassword) throws Exception {
        // 비밀번호 암호화

        Member member = new Member();
        member.setMemId(memId);
        member.setMemName(memName);
        member.setMemEmail(memEmail);
        member.setMemPassword(rawPassword);
        member.setRegDate(LocalDateTime.now());
        member.setMemState("NORMAL");  // 기본 상태 설정

        memberRepository.save(member);
    }

    // 로그인 처리
    public boolean loginMember(String memId, String rawPassword) throws Exception {
        Optional<Member> optionalMember = memberRepository.findByMemId(memId);
        log.info(optionalMember.toString());

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            log.info(rawPassword);
            log.info(member.getMemPassword());

            // 입력한 비밀번호와 복호화된 비밀번호 비교
            if (rawPassword.equals(member.getMemPassword())) {
                // 로그인 성공 처리
                return true;  // 로그인 성공
            }
        }
        return false;  // 로그인 실패
    }

    // 회원 정보 조회
    public Member getMemberInfo(String memId) {
        return memberRepository.findByMemId(memId).orElse(null);
    }

}
