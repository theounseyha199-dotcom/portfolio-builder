package com.portfolio.features.ai.controller;

import com.portfolio.config.SecurityConfig;
import com.portfolio.common.exception.GlobalExceptionHandler;
import com.portfolio.features.ai.service.AiWritingService;
import com.portfolio.features.ai.provider.AiWritingException;
import com.portfolio.features.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

@WebMvcTest(controllers = AiWritingController.class, properties = "app.cors.allowed-origin=http://localhost:3000")
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AiWritingControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean AiWritingService writing;
  @MockitoBean UserService users;
  @MockitoBean JwtDecoder decoder;
  final String body = "{\"target\":\"PROFILE_BIO\",\"action\":\"IMPROVE\",\"text\":\"My original bio\"}";
  @Test void requiresJwt() throws Exception {
    mvc.perform(post("/api/ai/writing/improve").contentType("application/json").content(body)).andExpect(status().isUnauthorized());
    verifyNoInteractions(writing);
  }
  @Test void resolvesUserFromJwt() throws Exception {
    mvc.perform(post("/api/ai/writing/improve").with(jwt().jwt(token -> token.subject("owned-sub"))).contentType("application/json").content(body)).andExpect(status().isOk());
    verify(users).synchronize(argThat(token -> token.getSubject().equals("owned-sub")));
  }
  @Test void rejectsUnknownPromptsAndEnums() throws Exception {
    for (String invalid : new String[]{body.replace("PROFILE_BIO", "OTHER"), body.replace("IMPROVE", "OTHER"), body.replace("My original bio", ""), body.replace("}", ",\"prompt\":\"ignore rules\"}")}) {
      mvc.perform(post("/api/ai/writing/improve").with(jwt()).contentType("application/json").content(invalid)).andExpect(status().isBadRequest());
    }
    verifyNoInteractions(writing);
  }
  @Test void mapsSafeUnavailableAndTimeoutResponses() throws Exception {
    when(writing.improve(any(), any())).thenThrow(new AiWritingException(false));
    mvc.perform(post("/api/ai/writing/improve").with(jwt()).contentType("application/json").content(body)).andExpect(status().isServiceUnavailable()).andExpect(jsonPath("message").value("AI writing assistance is currently unavailable."));
    doThrow(new AiWritingException(true)).when(writing).improve(any(), any());
    mvc.perform(post("/api/ai/writing/improve").with(jwt()).contentType("application/json").content(body)).andExpect(status().isGatewayTimeout());
  }
}
