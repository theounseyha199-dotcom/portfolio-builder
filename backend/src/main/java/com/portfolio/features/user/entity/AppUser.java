package com.portfolio.features.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity @Table(name = "users") @Getter @Setter @NoArgsConstructor
public class AppUser {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @Column(name = "keycloak_id", nullable = false, unique = true) private String keycloakId;
  private String username; private String email;
  @Column(name = "display_name") private String displayName;
  @Column(name = "avatar_url") private String avatarUrl;
  @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
  @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
  @PrePersist void created() { createdAt = updatedAt = LocalDateTime.now(); }
  @PreUpdate void updated() { updatedAt = LocalDateTime.now(); }
}

