package com.portfolio.features.ai.service;

import com.portfolio.features.ai.config.AiConfiguration;
import com.portfolio.features.ai.dto.AiWritingRequest;
import com.portfolio.features.ai.model.*;
import com.portfolio.features.ai.provider.*;
import com.portfolio.features.user.entity.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class AiWritingServiceTest {
  final AiProvider provider = mock(AiProvider.class);
  final AiWritingService service = new AiWritingService(provider, new AiConfiguration("openai", "", "", 15, 5000));
  final AppUser user = new AppUser();

  @ParameterizedTest @EnumSource(AiWritingTarget.class)
  void rewritesOnlySuppliedText(AiWritingTarget target) {
    when(provider.generate(anyString(), anyString())).thenReturn("Built a platform using Next.js.");
    var request = new AiWritingRequest(target, AiWritingAction.IMPROVE, "I built a platform using Next.js.");
    var response = service.improve(user, request);
    assertThat(response.originalText()).isEqualTo(request.text());
    assertThat(response.suggestedText()).isEqualTo("Built a platform using Next.js.");
    verify(provider).generate(contains("Do not invent facts"), eq(request.text()));
    assertThat(service.prompt(request)).contains("Preserve supplied numbers", "preserve supplied technologies", "untrusted source");
  }
  @ParameterizedTest @EnumSource(AiWritingAction.class)
  void supportsExperienceActions(AiWritingAction action) {
    when(provider.generate(anyString(), anyString())).thenReturn("Built tools.");
    assertThat(service.improve(user, new AiWritingRequest(AiWritingTarget.EXPERIENCE_DESCRIPTION, action, "Built tools.")).action()).isEqualTo(action);
  }
  @Test void rejectsInvalidProfileAction() {
    assertThatThrownBy(() -> service.improve(user, new AiWritingRequest(AiWritingTarget.PROFILE_BIO, AiWritingAction.HIGHLIGHT_IMPACT, "My text here"))).isInstanceOf(IllegalArgumentException.class);
    verifyNoInteractions(provider);
  }
  @Test void rejectsBlankShortLongAndUnauthenticatedInputs() {
    for (String text : new String[]{"", "    ", "abcd", "x".repeat(3001)}) {
      assertThatThrownBy(() -> service.improve(user, new AiWritingRequest(AiWritingTarget.PROFILE_BIO, AiWritingAction.IMPROVE, text))).isInstanceOf(IllegalArgumentException.class);
    }
    assertThatThrownBy(() -> service.improve(null, new AiWritingRequest(AiWritingTarget.PROFILE_BIO, AiWritingAction.IMPROVE, "My text"))).isInstanceOf(IllegalArgumentException.class);
    verifyNoInteractions(provider);
  }
  @Test void rejectsBadOutputAndInventedMetrics() {
    for (String text : new String[]{"", " ", "x".repeat(5001), "Built 50 tools.", "<script>bad</script>", "bad\uFFFD"}) {
      when(provider.generate(anyString(), anyString())).thenReturn(text);
      assertThatThrownBy(() -> service.improve(user, new AiWritingRequest(AiWritingTarget.PROJECT_DESCRIPTION, AiWritingAction.IMPROVE, "Built tools."))).isInstanceOf(AiWritingException.class);
    }
  }
  @Test void preservesSuppliedMetrics() {
    when(provider.generate(anyString(), anyString())).thenReturn("Improved performance by 40%.");
    assertThat(service.improve(user, new AiWritingRequest(AiWritingTarget.PROJECT_DESCRIPTION, AiWritingAction.IMPROVE, "performance improved by 40%")).suggestedText()).contains("40%");
  }
  @Test void propagatesSafeTimeoutAndUnavailableErrors() {
    for (boolean timeout : new boolean[]{true, false}) {
      doThrow(new AiWritingException(timeout)).when(provider).generate(anyString(), anyString());
      assertThatThrownBy(() -> service.improve(user, new AiWritingRequest(AiWritingTarget.PROFILE_BIO, AiWritingAction.IMPROVE, "My bio text"))).isInstanceOf(AiWritingException.class);
    }
  }
}
