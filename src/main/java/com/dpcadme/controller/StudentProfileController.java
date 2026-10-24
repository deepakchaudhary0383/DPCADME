package com.dpcadme.controller;

import com.dpcadme.dto.StudentResponse;
import com.dpcadme.entity.StudentProfile;
import com.dpcadme.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
 
@RestController
@RequestMapping("/api/students")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @PostMapping
    public ResponseEntity<StudentResponse> createProfile(
            @RequestBody StudentProfile profile) {

        StudentProfile savedProfile =
                studentProfileService.saveProfile(profile);

        return ResponseEntity.ok(toResponse(savedProfile));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllProfiles() {

        List<StudentResponse> responses =
                studentProfileService.getAllProfiles()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentResponse> getProfileByUserId(
            @PathVariable Long userId) {

        return studentProfileService.getProfileByUserId(userId)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getProfileById(
            @PathVariable Long id) {

        return studentProfileService.getProfileById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody StudentProfile updatedProfile) {

        return studentProfileService.getProfileById(id)
                .map(existingProfile -> {

                    existingProfile.setCourse(updatedProfile.getCourse());
                    existingProfile.setDepartment(updatedProfile.getDepartment());
                    existingProfile.setYear(updatedProfile.getYear());
                    existingProfile.setSkills(updatedProfile.getSkills());
                    existingProfile.setBio(updatedProfile.getBio());

                    StudentProfile savedProfile =
                            studentProfileService.saveProfile(existingProfile);

                    return ResponseEntity.ok(toResponse(savedProfile));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id) {

        studentProfileService.deleteProfile(id);

        return ResponseEntity.noContent().build();
    }

    private StudentResponse toResponse(StudentProfile profile) {

        return new StudentResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getUser().getRole(),
                profile.getCourse(),
                profile.getDepartment(),
                profile.getYear(),
                profile.getSkills(),
                profile.getBio()
        );
    }
}