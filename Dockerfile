# Build Stage
FROM openjdk:11-jdk-slim AS build

WORKDIR /app
COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
RUN ./gradlew dependencies --no-daemon

COPY . .
RUN ./gradlew clean build -x test

# Runtime Stage
FROM openjdk:11-jdk-slim

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
