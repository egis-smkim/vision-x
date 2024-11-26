# 1. Gradle 빌드에 필요한 JDK를 기반 이미지로 설정
FROM openjdk:11-jdk-slim AS build

WORKDIR /app

# 2. Gradle Wrapper 및 설정 파일 복사 (gradlew 포함)
COPY gradlew /app/gradlew
COPY gradle /app/gradle
COPY settings.gradle /app/settings.gradle
COPY build.gradle /app/build.gradle

# 3. Gradle Wrapper 실행 권한 부여
RUN chmod +x ./gradlew

# 4. Gradle 의존성 캐시 활용
RUN ./gradlew dependencies

# 5. 전체 소스 코드 복사
COPY . /app

# 6. Gradle 빌드 실행 (테스트 제외)
RUN ./gradlew clean build -x test

# 7. 런타임 이미지를 기반으로 실행 환경 설정
FROM openjdk:11-jdk-slim

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
