package com.portfolio.features.resume.dto.request;
import java.util.List;
public record ResumeProjectImportRequest(boolean selected, String title, String description, String githubUrl, String demoUrl, List<String> technologies) {}
