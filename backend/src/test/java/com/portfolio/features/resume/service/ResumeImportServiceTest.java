package com.portfolio.features.resume.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.portfolio.features.education.repository.EducationRepository;
import com.portfolio.features.experience.entity.Experience;
import com.portfolio.features.experience.repository.ExperienceRepository;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioRepository;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.project.entity.Project;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.resume.dto.request.*;
import com.portfolio.features.skill.entity.Skill;
import com.portfolio.features.skill.repository.SkillRepository;
import com.portfolio.features.user.entity.AppUser;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class ResumeImportServiceTest {
  private final PortfolioAccessService access = mock(PortfolioAccessService.class); private final PortfolioRepository portfolios = mock(PortfolioRepository.class); private final ExperienceRepository experiences = mock(ExperienceRepository.class); private final EducationRepository educations = mock(EducationRepository.class); private final SkillRepository skills = mock(SkillRepository.class); private final ProjectRepository projects = mock(ProjectRepository.class);
  private final ResumeImportService service = new ResumeImportService(access, portfolios, experiences, educations, skills, projects);
  private final AppUser user = new AppUser(); private final Portfolio portfolio = new Portfolio();
  ResumeImportServiceTest() { portfolio.setId(UUID.randomUUID()); when(access.mine(user)).thenReturn(portfolio); when(experiences.findByPortfolioIdOrderBySortOrderAscStartDateDesc(portfolio.getId())).thenReturn(new ArrayList<>()); when(educations.findByPortfolioIdOrderBySortOrderAscStartDateDesc(portfolio.getId())).thenReturn(new ArrayList<>()); when(skills.findByPortfolioIdOrderBySortOrderAscNameAsc(portfolio.getId())).thenReturn(new ArrayList<>()); when(projects.findByPortfolioIdOrderBySortOrderAscTitleAsc(portfolio.getId())).thenReturn(new ArrayList<>()); }
  @Test void selectedProfileUpdatesOnlyPresentValues() { var result = service.importResume(user, request(new ResumeProfileImportRequest(true, " Ada ", null, "ada@example.com", null, null), List.of(), List.of(), List.of(), List.of())); assertTrue(result.profileUpdated()); assertEquals("Ada", portfolio.getFullName()); assertEquals("ada@example.com", portfolio.getPublicEmail()); verify(portfolios).save(portfolio); }
  @Test void selectedExperienceIsPersistedAndUnselectedIsIgnored() { var selected = new ResumeExperienceImportRequest(true, "Acme", "Engineer", null, LocalDate.of(2024,1,1), null, true, null); var ignored = new ResumeExperienceImportRequest(false, "Ignore", "Ignore", null, null, null, false, null); var result = service.importResume(user, request(null, List.of(selected, ignored), List.of(), List.of(), List.of())); assertEquals(1, result.experiences().imported()); assertEquals(1, result.imported()); ArgumentCaptor<Experience> saved = ArgumentCaptor.forClass(Experience.class); verify(experiences).save(saved.capture()); assertEquals("Acme", saved.getValue().getCompany()); assertTrue(saved.getValue().isCurrentlyWorking()); }
  @Test void duplicateExperienceAndEducationAreSkipped() { Experience existingExperience = new Experience(); existingExperience.setCompany("Acme"); existingExperience.setPosition("Engineer"); existingExperience.setStartDate(LocalDate.of(2024,1,1)); when(experiences.findByPortfolioIdOrderBySortOrderAscStartDateDesc(portfolio.getId())).thenReturn(new ArrayList<>(List.of(existingExperience))); var experience = new ResumeExperienceImportRequest(true, "acme", "engineer", null, LocalDate.of(2024,1,1), null, false, null); var result = service.importResume(user, request(null, List.of(experience), List.of(), List.of(), List.of())); assertEquals(1, result.experiences().skipped()); verify(experiences, never()).save(any()); }
  @Test void skillsAreDeduplicatedCaseInsensitively() { Skill existing = new Skill(); existing.setName("Java"); when(skills.findByPortfolioIdOrderBySortOrderAscNameAsc(portfolio.getId())).thenReturn(new ArrayList<>(List.of(existing))); var result = service.importResume(user, request(null, List.of(), List.of(), List.of(new ResumeSkillImportRequest(true, "java", null)), List.of())); assertEquals(1, result.skills().skipped()); verify(skills, never()).save(any()); }
  @Test void projectTechnologiesArePersistedAndDuplicateProjectIsSkipped() { var project = new ResumeProjectImportRequest(true, "Portfolio", "", "https://github.com/a/p", null, List.of("Java", "Java", " Spring ")); var imported = service.importResume(user, request(null, List.of(), List.of(), List.of(), List.of(project))); assertEquals(1, imported.projects().imported()); ArgumentCaptor<Project> saved = ArgumentCaptor.forClass(Project.class); verify(projects).save(saved.capture()); assertEquals(2, saved.getValue().getTechnologies().size()); Project existing = new Project(); existing.setTitle("Portfolio"); when(projects.findByPortfolioIdOrderBySortOrderAscTitleAsc(portfolio.getId())).thenReturn(new ArrayList<>(List.of(existing))); var skipped = service.importResume(user, request(null, List.of(), List.of(), List.of(), List.of(project))); assertEquals(1, skipped.projects().skipped()); }
  @Test void validRecordsPersistWhenAnotherSelectedRecordIsInvalid() { var valid = new ResumeSkillImportRequest(true, "Java", null); var invalid = new ResumeSkillImportRequest(true, " ", null); var result = service.importResume(user, request(null, List.of(), List.of(), List.of(valid, invalid), List.of())); assertEquals(1, result.imported()); assertEquals(0, result.skipped()); assertEquals(1, result.failed()); assertEquals(1, result.skills().imported()); assertEquals(1, result.skills().failed()); verify(skills).save(any(Skill.class)); }
  private static ResumeImportRequest request(ResumeProfileImportRequest profile, List<ResumeExperienceImportRequest> experiences, List<ResumeEducationImportRequest> educations, List<ResumeSkillImportRequest> skills, List<ResumeProjectImportRequest> projects) { return new ResumeImportRequest(profile, experiences, educations, skills, projects); }
}
