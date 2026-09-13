package com.portfolio.features.resume.dto;
import java.util.List;
public record ResumePreviewResponse(Profile profile, List<Experience> experiences, List<Education> educations, List<Skill> skills, List<Project> projects, List<String> warnings) {
  public record Profile(String fullName, String headline, String email, String phone, String location, String website, String linkedinUrl, String githubUrl) {}
  public record Experience(String company, String position, String location, String startDate, String endDate, boolean currentlyWorking, String description, String rawText) {}
  public record Education(String school, String degree, String major, String startDate, String endDate, String description, String rawText) {}
  public record Skill(String name, String category) {}
  public record Project(String title, String description, String githubUrl, String demoUrl, List<String> technologies, String rawText) {}
}
