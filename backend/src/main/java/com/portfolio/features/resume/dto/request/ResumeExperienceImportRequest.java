package com.portfolio.features.resume.dto.request;
import java.time.LocalDate;
public record ResumeExperienceImportRequest(boolean selected, String company, String position, String location, LocalDate startDate, LocalDate endDate, boolean currentlyWorking, String description) {}
