# 1. Gradle 환경 준비
FROM openjdk:17-jdk-slim as build
WORKDIR /app
COPY gradle gradle
COPY gradlew .
COPY settings.gradle .
COPY build.gradle .

# Gradle 의존성 캐싱
RUN ./gradlew dependencies --no-daemon

# 2. 소스 복사 및 빌드
COPY . .
RUN ./gradlew clean build -x test

# 3. 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
