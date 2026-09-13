package com.portfolio.features.resume.parser;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
class RuleBasedResumeParserTest {
  private final RuleBasedResumeParser parser = new RuleBasedResumeParser();
  private static final String RESUME = "Ada Lovelace\nSoftware Engineer\nada@example.com\n+1 (555) 123-4567\ngithub.com/ada\nlinkedin.com/in/ada\n\nWORK EXPERIENCE\n\nSoftware Engineer\nExample Company\nJan 2024 - Present\n• Built Java APIs\n\nEDUCATION\n\nExample University\nBachelor of Science\n\nTECHNICAL SKILLS\n\nJava, Spring Boot, PostgreSQL, Docker, java\n\nPROJECTS\n\nPortfolio Builder\nA portfolio app\nhttps://github.com/ada/portfolio\n";
  @Test void parsesContactDetails() { var preview=parser.parse(RESUME); assertEquals("ada@example.com",preview.profile().email()); assertTrue(preview.profile().phone().contains("555")); assertTrue(preview.profile().githubUrl().contains("github.com")); assertTrue(preview.profile().linkedinUrl().contains("linkedin.com")); }
  @Test void detectsExperienceAndEducation() { var preview=parser.parse(RESUME); assertEquals("Software Engineer",preview.experiences().getFirst().position()); assertEquals("Example Company",preview.experiences().getFirst().company()); assertTrue(preview.experiences().getFirst().currentlyWorking()); assertEquals("Example University",preview.educations().getFirst().school()); }
  @Test void parsesAndDeduplicatesSkills() { var skills=parser.parse(RESUME).skills(); assertEquals(4,skills.size()); assertTrue(skills.stream().anyMatch(skill->skill.name().equals("Java"))); }
  @Test void detectsProjects() { var project=parser.parse(RESUME).projects().getFirst(); assertEquals("Portfolio Builder",project.title()); assertTrue(project.githubUrl().contains("github.com")); }
  @Test void warnsForMissingSections() { var preview=parser.parse("Ada\nada@example.com"); assertTrue(preview.warnings().stream().anyMatch(warning->warning.contains("experience"))); assertTrue(preview.warnings().stream().anyMatch(warning->warning.contains("skills"))); }
}
