FROM openjdk:17

WORKDIR /app

COPY . .

RUN ./mvnw clean install -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/rideshare-0.0.1-SNAPSHOT.jar"]