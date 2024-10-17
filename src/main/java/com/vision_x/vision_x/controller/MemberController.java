package com.vision_x.vision_x.controller;

import com.vision_x.vision_x.entity.Member;
import com.vision_x.vision_x.service.MemberService;
import com.vision_x.vision_x.service.ObjectStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Controller
public class MemberController {

    @Autowired
    private MemberService memberService;
    @Autowired
    private ObjectStorageService objectStorageService;

    @GetMapping("/token")
    @ResponseBody
    public String getToken() {
        return objectStorageService.requestToken();
    }

    @GetMapping("/profile")
    public String userProfile(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession(false); // 기존 세션 가져오기

        if (session != null) {
            String userId = (String) session.getAttribute("USER_ID");
            if (userId != null) {
                model.addAttribute("user", memberService.getMemberInfo(userId));
                return "profile"; // 사용자 정보 페이지 반환
            }
        }
        return "redirect:/login"; // 세션이 없으면 로그인 페이지로 리다이렉트
    }

    // 회원가입 페이지로 이동
    @GetMapping("/register")
    public String showRegisterForm() {
        return "register";
    }

    // 회원가입 처리
    @PostMapping("/register")
    public String registerMember(@RequestParam String memId,
                                 @RequestParam String memName,
                                 @RequestParam String memEmail,
                                 @RequestParam String memPassword) throws Exception {
        memberService.registerMember(memId, memName, memEmail, memPassword);
        return "redirect:/login";  // 회원가입 후 로그인 페이지로 이동
    }


    @PostMapping("/login")
    public String loginMember(@RequestParam String memId,
                              @RequestParam String memPassword,
                              HttpServletRequest request,
                              HttpServletResponse response) throws Exception {

        boolean isAuthenticated = memberService.loginMember(memId, memPassword);

        if (isAuthenticated) {
            log.info("Login successful");
            HttpSession session = request.getSession();

            // 세션 ID를 가져옵니다.
            String sessionId = session.getId();

            // 새로운 JSESSIONID 쿠키를 생성합니다.
            Cookie sessionCookie = new Cookie("JSESSIONID", sessionId);
            sessionCookie.setDomain(".vision-x.kr"); // 공통 도메인으로 설정
            sessionCookie.setPath("/"); // 경로를 루트로 설정
            sessionCookie.setHttpOnly(true); // 보안을 위해 HttpOnly 설정
            sessionCookie.setSecure(true); // HTTPS에서만 쿠키 전송

            // 응답에 쿠키 추가
            response.addCookie(sessionCookie);
            // 인증이 성공하면 해당 URL로 리다이렉션
            return "/";
        } else {
            log.info("Login failed");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write("<script>alert('비밀번호가 틀렸습니다. 다시 시도해주세요.'); history.back();</script>");
            return null;
        }

    }
    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }

        Cookie sessionCookie = new Cookie("JSESSIONID", null);
        sessionCookie.setMaxAge(0); // 쿠키 만료 설정
        sessionCookie.setPath("/");
        sessionCookie.setDomain(".vision-x.kr");
        response.addCookie(sessionCookie);

        return "redirect:/"; // 로그아웃 후 메인 페이지로 리다이렉션
    }

    // 회원 정보 조회
    @GetMapping("/member/{memId}")
    @ResponseBody
    public Member getMemberInfo(@PathVariable String memId) {
        return memberService.getMemberInfo(memId);
    }
}
