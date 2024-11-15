package com.test1115.springboot_test1115.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/*
 * JwtProvider 클래스
 * jwt ( json web token ) 생성하고 검증하는 역할
 * JWT 토큰을 생성하고 검증하는 역할
 * HS256 암호화 알고리즘을 사용하여 JWT 서명
 * 비밀키는 Base64로 인코딩 지정 - 환경변수(jwt.secret)
 * JWT 만료 기간은 10시간 지정 - 환경변수(jwt.expiration) application.properties 에 작성했다.
 * # JWT 만료시간 (10시간)
 * jwt.expiration=36000000
 * 사용자 정보를 암호화된 토큰으로 저장 서버에 매번 요청할 떄 전달 가능하다. 주로 로그인 인증에 사용된다.
 */

@Component // 스프링 컨테이너에서 해당 클래스를 빈으로 관리하기 위해 사용

// cf) @Bean: 메서드 레벨에서 선언, 반환되는 객체를 개발자가 수동으로 빈 등록
//     @Component: 클래스 레벨에서 선언, 스프링 런타임 시 컴포넌트 스캔을 통해
//                  자동으로 빈을 찾고 등록하는 애너테이션 (의존성 주입)
// 자동으로 빈을 찾고 등록하는건 디스패쳐 서블릿이 한다 ( 애너테이션을 가지고 여러가지 행위를 한다. )

public class JwtProvider {

    // 환경 변수에 지정한 비밀키 값과
    private final Key key; // JWT 서명에 사용할 암호화 키

    // 환경 변수 만료 시간을 가져옴 ( getExpiration() 함수로 jwtExpirationMs를 가져옴 )
    // 토큰 만료 시간을 밀리초로 반환 하는 메서드 (getter)
    public int getExpiration() {
        return jwtExpirationMs;
    }
    // 환경 변수 만료 시간을 가져옴
    @Value("${jwt.expiration}")
    private int jwtExpirationMs; // JWT 토큰의 만료 시간을 저장

    // JwtProvider 생성자
    // (setter)
    public JwtProvider(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.expiration}") int jwtExpirationMs) {

        // 생성자: JWTProvider 객체를 생성할 때 비밀키와 만료 시간을 초기화

        //Base64로 인코딩된 비밀키를 디코딩하여 HMAC-SHA 알고리즘으로 암호화된 키 생성
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));

        // 환경 변수에서 가져온 만료 시간을 변수에 저장
        this.jwtExpirationMs = jwtExpirationMs;
    }

    /*
     * generateJwtToken
     * : JWT 생성 메서드
     * : 사용자 정보를 받아 JWT 토큰을 생성하는 메서드
     *
     * 1. jwt 생성 및 반환
     * 2. 현재 시간, 만료 시간 설정
     * 3. 토큰 서명 포함
     *
     * @param : 사용자 정보 (User 객체)
     * @return : 생성된 JWT 토큰 문자열
     * */
    public String generateJwtToken(String userId) {
        // 사용자(클라이언트)에게 주려고 만드는 토큰
        return Jwts.builder()
                .claim("userId", userId) // 클레임에 사용자 ID 저장 (사용자의 고유 ID)
                .setIssuedAt(new Date()) // 현재 시간을 기준으로 토큰 발행 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                // 현재 시간에 만료 시간을 더해 토큰 만료시간 설정
                .signWith(key, SignatureAlgorithm.HS256)
                // HMAC-SHA256 알고리즘으로 생성된 비밀키로 서명
                .compact();
        // JWT를 최종적으로 직렬화하여 문자열로 반환
    }

    /*
     * 이메일 검증용 JWT "생성" 메서드
     * 1. 이메일 검증용 토큰 (5분간 유효)
     *
     * @param username - 사용자이름
     * @return 이메일 검증을 위한 JWT 토큰
     * */
    public String generateEmailValidToken(String username) {
        return Jwts.builder()
                .claim("username", username) // ("칼럼명" , 매개변수 값= 받는값) => 로그인할때 받는걸 얘기함 "이 이름으로" , 이 값을 저장 시켜라 (로그인할 때 값은 받는거)
                // 어쨋든 이걸 클레임에 저장하는데 이걸 filter 함
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 5)))
                // : 현재 시간에 5분을 더해 토큰 만료 시간 설정
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /*
     * JWT 에서 Bearer 접두사 제거
     *
     * Bearer 접두사를 제거하여 JWT 만 반환
     * Authorization 헤더로부터 Bearer 를 제거하는 데 사용
     *
     * @param bearerToken - 접두사가 포함된 JWT 문자열
     * @return Bearer 이 제거된 JWT
     *
     * cf) Bearer: 소유자

     * */
    public String removeBearer(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid JWT token format");
        }
        return bearerToken.substring("Bearer ".length());
    }

    /*
     * JWT 검증 & 사용자 ID 추출
     * JWT 에서 사용자 ID 클레임을 추출해 반환
     * 인증된 사용자를 특정하기 위한 정보로 사용
     *
     * @param token - JWT 토큰
     * @return 사용자 ID - 클레임에서 추출된 값
     * */
    public String getUserIdFromJwt(String token) { // jwtPrivider.get(동일하게)FromJwt(String token) 이 되어야함
        // JWT에서 클레임 정보를 추출 - claim 객체에 저장
        Claims claims = getClaims(token);  // token 은 스트링값.

        // 클레임에서 userId 값을 문자열 형태로 반환
        return claims.get("userId", String.class); // 키 값? userId 변수로 받았던걸 처음에 저장할때 매개변수를 String 온다.

    }

    /*
     * JWT 유효성 검증
     * 토큰의 유효성을 검사하여 true 또는 false를 반환
     * 만료 여부와 올바른 형식인지 검증하는 역할 담당
     *
     * @param token - JWT 토큰
     * @return 유효하면 true, 그렇지 않으면 false
     * */
    public boolean isValidToken(String token) {
        try {
            getClaims(token); // JWT 클레임을 가져오면서 유효성 검증
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /*
     * JWT 클레임 정보 가져오기
     * 토큰의 클레임 정보를 추출하여 반환
     * JWT 본문에서 사용자 정보와 같은 세부 정보를 읽어옴
     *
     * @param token - JWT 토큰
     * @return 클레임 정보
     * */
    public Claims getClaims(String token) {
        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(key) // JWT 파서에 서명에 사용된 비밀키 설정
                .build();

        // JWT를 파싱하여 클레임 정보(body)를 반환
        return jwtParser.parseClaimsJws(token).getBody();
    }
}