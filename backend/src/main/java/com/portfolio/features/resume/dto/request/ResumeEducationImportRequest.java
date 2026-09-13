package com.portfolio.features.resume.dto.request;
import java.time.LocalDate;
public record ResumeEducationImportRequest(boolean selected, String school, String degree, String major, LocalDate startDate, LocalDate endDate, String description) {}
