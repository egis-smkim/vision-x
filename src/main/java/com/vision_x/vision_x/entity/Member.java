package com.vision_x.vision_x.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MID")
    private Integer mid;

    @Column(name = "GID")
    private Integer gid;

    @Column(name = "DID")
    private Integer did;

    @Column(name = "MPGID", columnDefinition = "int default 0")
    private Integer mpgid;

    @Column(name = "DLID", columnDefinition = "int")
    private Integer dlid;

    @Column(name = "MEM_ID", nullable = false, length = 255)
    private String memId;

    @Column(name = "MEM_NAME", length = 100)
    private String memName;

    @Column(name = "MEM_EMAIL", length = 255)
    private String memEmail;

    @Column(name = "MEM_PASSWORD")
    private String memPassword;

    @Column(name = "MEM_PASSWORD_SALT")
    private String memPasswordSalt;

    @Column(name = "MEM_STATE", length = 20, columnDefinition = "varchar(20) default 'NORMAL'")
    private String memState;

    @Column(name = "MEM_LEVEL", columnDefinition = "int default -1")
    private Integer memLevel;

    @Column(name = "MEM_THUMB", length = 255, columnDefinition = "varchar(255) default ''")
    private String memThumb;

    @Column(name = "MEM_JOIN_TYPE")
    private Boolean memJoinType = true;


    @Column(name = "MEM_GEO_DB", length = 60)
    private String memGeoDb;

    @Column(name = "MEM_DATA_DB", length = 60)
    private String memDataDb;

    @Column(name = "LOGIN_COUNT")
    private Integer loginCount;

    @Column(name = "LAST_LOGIN")
    private LocalDateTime lastLogin;

    @Column(name = "REG_DATE")
    private LocalDateTime regDate;

    @Column(name = "LAST_UPDATE")
    private LocalDateTime lastUpdate;

    @Column(name = "MEM_PROFILE_IMG", length = 100)
    private String memProfileImg;

    @Column(name = "LAST_PWD_UPDATE")
    private LocalDateTime lastPwdUpdate;

    @Column(name = "TEMP_PWD_FLAG")
    private Integer tempPwdFlag;

    @Column(name = "MEM_CREDENTIAL")
    private String memCredential;

    @Column(name = "MEM_AUTHKEY")
    private String memAuthkey;

    @Column(name = "MEM_OTP_FLAG", columnDefinition = "char(1) default '0'")
    private Character memOtpFlag;

    @Column(name = "OTP_COUNT")
    private Integer otpCount;

    @Column(name = "MEM_ID_ENCODE", length = 255)
    private String memIdEncode;

    @Column(name = "LAST_LOGIN_IP", length = 255)
    private String lastLoginIp;

    @Column(name = "VISITTING", columnDefinition = "int default 0")
    private Integer visitting;

    @Column(name = "MEM_USERSTORAGE")
    private Long memUserStorage;

    @Column(name = "GOOGLE_ID")
    private String googleId;
}

