FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Сначала копируем только pom.xml — кешируем зависимости
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Теперь копируем исходники и собираем
COPY src ./src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java",   "-XX:+UseContainerSupport",   "-XX:MaxRAMPercentage=75.0",   "-jar", "app.jar"]