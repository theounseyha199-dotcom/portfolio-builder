package com.portfolio.features.portfolio.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.util.List;
public record SectionRequest(@NotEmpty List<@Valid SectionItem> sections) {
 public record SectionItem(@Pattern(regexp="HERO|ABOUT|PROJECTS|EXPERIENCE|EDUCATION|SKILLS|SOCIAL|RESUME",message="Section is not supported.") String sectionType, @Min(1) int position, boolean enabled, @Pattern(regexp="[a-z-]{0,30}",message="Layout is not supported.") String layout, @Pattern(regexp="left|center",message="Alignment is not supported.") String alignment, @Pattern(regexp="default|muted|accent",message="Background is not supported.") String background, @Pattern(regexp="compact|normal|large",message="Spacing is not supported.") String spacing) {}
}
