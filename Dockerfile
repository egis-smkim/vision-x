FROM openjdk:11-jdk-slim AS build

WORKDIR /app

# 1. 의존성 관리 파일만 먼저 복사
COPY build.gradle settings.gradle /app/
WORKDIR /app

# 2. Gradle 의존성 캐싱
RUN ./gradlew dependencies

# 3. 나머지 소스 코드 복사
COPY . /app

# Gradle Wrapper 실행 권한 추가
RUN chmod +x ./gradlew

# 테스트를 제외하고 빌드
RUN ./gradlew clean build -x test

# 실행 환경 설정
FROM openjdk:11-jdk-slim

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
