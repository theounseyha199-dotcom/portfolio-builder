package com.portfolio.features.user.mapper;
import com.portfolio.features.user.dto.UserResponse; import com.portfolio.features.user.entity.AppUser;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring") public interface UserMapper { UserResponse toResponse(AppUser user); }

