package com.portfolio.features.portfolio.entity;

import com.portfolio.features.user.entity.AppUser; import jakarta.persistence.*; import java.time.LocalDateTime; import java.util.UUID; import lombok.*; import org.hibernate.annotations.JdbcTypeCode; import org.hibernate.type.SqlTypes;
@Entity @Table(name = "portfolios") @Getter @Setter @NoArgsConstructor
public class Portfolio {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id") private AppUser user;
  @Column(nullable = false, unique = true) private String slug;
  @Column(name = "full_name", nullable = false) private String fullName;
  private String headline; @Column(columnDefinition = "TEXT") private String bio;
  @Column(name = "profile_image_url", columnDefinition = "TEXT") private String profileImageUrl;
  private String location; @Column(name = "public_email") private String publicEmail; private String phone;
  @Column(name = "template_key", nullable = false) private String templateKey = "minimal";
  @JdbcTypeCode(SqlTypes.JSON) @Column(name = "theme_config", columnDefinition = "jsonb", nullable = false) private String themeConfig = "{}";
  @Column(nullable = false) private boolean published;
  @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
  @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
  @PrePersist void created() { createdAt = updatedAt = LocalDateTime.now(); }
  @PreUpdate void updated() { updatedAt = LocalDateTime.now(); }
}
