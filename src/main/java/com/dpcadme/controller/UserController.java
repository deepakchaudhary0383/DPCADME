package com.dpcadme.controller;

import com.dpcadme.dto.UserResponse;
import com.dpcadme.entity.User;
import com.dpcadme.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody User user) {

        User savedUser = userService.saveUser(user);

        return ResponseEntity.ok(toResponse(savedUser));
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> responses =
                userService.getAllUsers()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // ADMIN - STUDENTS
    // =========================

    // Get all students
    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getAllStudents() {

        List<UserResponse> responses =
                userService.getAllStudents()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // Search students
    @GetMapping("/students/search")
    public ResponseEntity<List<UserResponse>> searchStudents(
            @RequestParam(required = false, defaultValue = "") String keyword) {

        List<UserResponse> responses =
                userService.searchStudents(keyword)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // =========================
    // ADMIN - ALUMNI
    // =========================

    // Get all alumni
    @GetMapping("/alumni")
    public ResponseEntity<List<UserResponse>> getAllAlumni() {

        List<UserResponse> responses =
                userService.getAllAlumni()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // Search alumni
    @GetMapping("/alumni/search")
    public ResponseEntity<List<UserResponse>> searchAlumni(
            @RequestParam(required = false, defaultValue = "") String keyword) {

        List<UserResponse> responses =
                userService.searchAlumni(keyword)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    // =========================
    // ADMIN - DASHBOARD COUNTS
    // =========================

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getUserCounts() {

        Map<String, Long> counts = new HashMap<>();

        counts.put("students", userService.getStudentCount());
        counts.put("alumni", userService.getAlumniCount());

        return ResponseEntity.ok(counts);
    }

    // =========================
    // ADMIN - DELETE ACCOUNT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // RESPONSE CONVERTER
    // =========================

    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}