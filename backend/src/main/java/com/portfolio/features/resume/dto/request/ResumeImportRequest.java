package com.portfolio.features.resume.dto.request;
import jakarta.validation.Valid; import java.util.List;
public record ResumeImportRequest(@Valid ResumeProfileImportRequest profile, @Valid List<ResumeExperienceImportRequest> experiences, @Valid List<ResumeEducationImportRequest> educations, @Valid List<ResumeSkillImportRequest> skills, @Valid List<ResumeProjectImportRequest> projects) {}
