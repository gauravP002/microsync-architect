
export const userServiceCode = {
  entity: `package com.example.userservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}`,
  producer: `package com.example.userservice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "user-topic";

    public void sendMessage(Object event) {
        log.info("Producing event to {}: {}", TOPIC, event);
        kafkaTemplate.send(TOPIC, event);
    }
}`,
  controller: `package com.example.userservice.controller;

import com.example.userservice.entity.User;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegistrationController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }
}`,
  service: `package com.example.userservice.service;

import com.example.userservice.entity.User;
import com.example.userservice.kafka.UserProducer;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserProducer userProducer;

    @Transactional
    public User registerUser(User user) {
        User savedUser = userRepository.save(user);
        userProducer.sendMessage(savedUser);
        return savedUser;
    }
}`,
  yml: `spring:
  application:
    name: user-service
  datasource:
    url: jdbc:postgresql://localhost:5432/user_db
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer`
};

export const profileServiceCode = {
  entity: `package com.example.profile_service.service;

import com.example.profile_service.entity.Profile;
import com.example.profile_service.kafka.UserRegisteredEvent;
import com.example.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public void syncProfile(UserRegisteredEvent event) {

        if (!profileRepository.existsById(event.getUserId())) {

            Profile profile = new Profile();
            profile.setUserId(event.getUserId());
            profile.setName(event.getName());
            profile.setEmail(event.getEmail());

            profileRepository.save(profile);
        }
    }
}
`,
  consumer: `package com.example.profileservice.kafka;

import com.example.profileservice.entity.Profile;
import com.example.profileservice.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileConsumer {
    private final ProfileService profileService;

    @KafkaListener(topics = "user-topic", groupId = "profile-group")
    public void consume(Profile profileEvent) {
        log.info("Consumed event: {}", profileEvent);
        profileService.syncProfile(profileEvent);
    }
}`,
  service: `package com.example.profileservice.service;

import com.example.profileservice.entity.Profile;
import com.example.profileservice.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    public void syncProfile(Profile event) {
        if (!profileRepository.existsById(event.getUserId())) {
            profileRepository.save(event);
        }
    }
}`,
  yml: `spring:
  application:
    name: profile-service
  datasource:
    url: jdbc:postgresql://localhost:5432/profile_db
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: profile-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"`
};

export const infraCode = {
  dockerCompose: `# LOCAL SETUP GUIDE (NON-DOCKER)

1. PostgreSQL:
   Ensure PostgreSQL is running on localhost:5432.
   CREATE DATABASE user_db;
   CREATE DATABASE profile_db;

2. Kafka:
   Ensure Apache Kafka is running on localhost:9092.
   - Start Zookeeper: bin/zookeeper-server-start.sh config/zookeeper.properties
   - Start Kafka: bin/kafka-server-start.sh config/server.properties

3. Startup:
   - Run User Service: ./mvnw spring-boot:run (Port 8080)
   - Run Profile Service: ./mvnw spring-boot:run (Port 8081)`,
  sql: `CREATE DATABASE user_db;
CREATE DATABASE profile_db;`
};
