package com.comicverse.auth.service;

import com.comicverse.auth.dto.LoginRequest;
import com.comicverse.auth.dto.LoginResponse;
import com.comicverse.auth.dto.RegisterRequest;
import com.comicverse.auth.event.EventPublisher;
import com.comicverse.auth.model.User;
import com.comicverse.auth.repository.RefreshTokenRepository;
import com.comicverse.auth.repository.UserRepository;
import com.comicverse.auth.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EventPublisher eventPublisher;

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(100L);
        sampleUser.setUsername("testuser");
        sampleUser.setEmail("test@comicverse.local");
        sampleUser.setPasswordHash("hashed_password");
        sampleUser.setRole("USER");
        sampleUser.setActive(true);
    }

    @Test
    void register_Success() {
        RegisterRequest registerReq = new RegisterRequest("testuser", "test@comicverse.local", "password123");

        when(userRepository.existsByEmail("test@comicverse.local")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtTokenProvider.generateAccessToken(eq(100L), any(), any(), any())).thenReturn("mock_access_token");
        when(jwtTokenProvider.generateRefreshToken(eq(100L))).thenReturn("mock_refresh_token");

        LoginResponse response = authService.register(registerReq, httpRequest, httpResponse);

        assertNotNull(response);
        assertEquals("mock_access_token", response.getAccessToken());
        assertEquals("testuser", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
        verify(eventPublisher, times(1)).publishUserRegistered(any(), any());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest registerReq = new RegisterRequest("testuser", "existing@comicverse.local", "password123");
        when(userRepository.existsByEmail("existing@comicverse.local")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerReq, httpRequest, httpResponse));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_DuplicateUsername_ThrowsException() {
        RegisterRequest registerReq = new RegisterRequest("existinguser", "test@comicverse.local", "password123");
        when(userRepository.existsByEmail("test@comicverse.local")).thenReturn(false);
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerReq, httpRequest, httpResponse));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_Success() {
        LoginRequest loginReq = new LoginRequest("test@comicverse.local", "password123");

        when(userRepository.findByEmail("test@comicverse.local")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(eq(100L), any(), any(), any())).thenReturn("mock_access_token");
        when(jwtTokenProvider.generateRefreshToken(eq(100L))).thenReturn("mock_refresh_token");

        LoginResponse response = authService.login(loginReq, httpRequest, httpResponse);

        assertNotNull(response);
        assertEquals("mock_access_token", response.getAccessToken());
        assertEquals(100L, response.getUserId());
    }

    @Test
    void login_InvalidPassword_ThrowsBadCredentials() {
        LoginRequest loginReq = new LoginRequest("test@comicverse.local", "wrongpassword");

        when(userRepository.findByEmail("test@comicverse.local")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "hashed_password")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(loginReq, httpRequest, httpResponse));
    }
}
