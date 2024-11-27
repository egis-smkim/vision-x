# Dockerfile
FROM openjdk:11-jdk-slim

# Set working directory
WORKDIR /app

# Copy Gradle files
COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .

# Install dependencies
RUN ./gradlew dependencies --no-daemon

# 2. 소스 복사 및 빌드
COPY . .
RUN ./gradlew clean build -x test

# 3. 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
