FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY services/shared/pom.xml services/shared/
COPY services/api-gateway/pom.xml services/api-gateway/
COPY services/auth-service/pom.xml services/auth-service/
COPY services/story-service/pom.xml services/story-service/
COPY services/sync-service/pom.xml services/sync-service/
COPY services/user-service/pom.xml services/user-service/
COPY services/payment-service/pom.xml services/payment-service/
COPY services/recommendation-service/pom.xml services/recommendation-service/
COPY services/chat-service/pom.xml services/chat-service/
COPY services/notification-service/pom.xml services/notification-service/
COPY services/search-service/pom.xml services/search-service/
COPY services/media-service/pom.xml services/media-service/
COPY services/shared/src services/shared/src
COPY services/story-service/src services/story-service/src
RUN mvn clean package -pl services/story-service -am -DskipTests -B --no-transfer-progress

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S comicverse && adduser -S comicverse -G comicverse
COPY --from=build /app/services/story-service/target/*.jar app.jar
RUN chown comicverse:comicverse app.jar
USER comicverse
EXPOSE 8082
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8082/api/v1/health || exit 1
ENTRYPOINT ["java","-XX:+UseContainerSupport","-XX:MaxRAMPercentage=75.0","-jar","app.jar"]
