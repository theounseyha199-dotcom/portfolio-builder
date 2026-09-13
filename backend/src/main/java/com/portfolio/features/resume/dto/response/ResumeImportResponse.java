package com.portfolio.features.resume.dto.response;
public record ResumeImportResponse(int imported, int skipped, int failed, boolean profileUpdated, Section experiences, Section educations, Section skills, Section projects) { public record Section(int imported, int skipped, int failed) {} }
