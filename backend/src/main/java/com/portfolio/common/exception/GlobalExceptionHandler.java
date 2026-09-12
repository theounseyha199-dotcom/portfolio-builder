package com.portfolio.common.exception;

import com.portfolio.common.api.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException.class) ResponseEntity<ApiResponse<Void>> notFound(NotFoundException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage())); }
  @ExceptionHandler(ConflictException.class) ResponseEntity<ApiResponse<Void>> conflict(ConflictException e) { return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(e.getMessage())); }
  @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiResponse<Void>> invalid(MethodArgumentNotValidException e) { return ResponseEntity.badRequest().body(ApiResponse.error(e.getBindingResult().getFieldError().getDefaultMessage())); }
  @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiResponse<Void>> invalidArgument(IllegalArgumentException e) { return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage())); }
}
