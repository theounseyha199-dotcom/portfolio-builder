package com.portfolio.features.resume.dto.request;
import jakarta.validation.constraints.Email;
public record ResumeProfileImportRequest(boolean selected, String fullName, String headline, @Email(message="Email must be valid.") String email, String phone, String location, String website, String linkedinUrl, String githubUrl) {}
