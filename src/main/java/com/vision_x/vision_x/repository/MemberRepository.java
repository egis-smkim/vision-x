package com.vision_x.vision_x.repository;

import com.vision_x.vision_x.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByMemEmail(String email);

    // MEM_ID로 사용자 조회
    Optional<Member> findByMemId(String memId);
}
