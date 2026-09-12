package com.portfolio.features.user.service;

import com.portfolio.features.user.entity.AppUser; import com.portfolio.features.user.repository.AppUserRepository;
import org.springframework.security.oauth2.jwt.Jwt; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class UserService {
  private final AppUserRepository users;
  @Transactional public AppUser synchronize(Jwt jwt) {
    return users.findByKeycloakId(jwt.getSubject()).orElseGet(() -> {
      AppUser user = new AppUser(); user.setKeycloakId(jwt.getSubject()); user.setUsername(jwt.getClaimAsString("preferred_username")); user.setEmail(jwt.getClaimAsString("email")); user.setDisplayName(jwt.getClaimAsString("name")); return users.save(user);
    });
  }
}

