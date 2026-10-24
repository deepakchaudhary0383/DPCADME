package com.dpcadme.controller;

import com.dpcadme.dto.AlumniResponse;
import com.dpcadme.entity.AlumniProfile;
import com.dpcadme.service.AlumniProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
public class AlumniProfileController {

    private final AlumniProfileService alumniProfileService;

    public AlumniProfileController(AlumniProfileService alumniProfileService) {
        this.alumniProfileService = alumniProfileService;
    }

    @PostMapping
    public ResponseEntity<AlumniResponse> createProfile(
            @RequestBody AlumniProfile profile) {

        AlumniProfile savedProfile =
                alumniProfileService.saveProfile(profile);

        return ResponseEntity.ok(toResponse(savedProfile));
    }

    @GetMapping
    public ResponseEntity<List<AlumniResponse>> getAllProfiles() {

        List<AlumniResponse> responses =
                alumniProfileService.getAllProfiles()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AlumniResponse> getProfileByUserId(
            @PathVariable Long userId) {

        return alumniProfileService.getProfileByUserId(userId)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumniResponse> getProfileById(
            @PathVariable Long id) {

        return alumniProfileService.getProfileById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlumniResponse>> searchByCompany(
            @RequestParam String company) {

        List<AlumniResponse> responses =
                alumniProfileService.searchByCompany(company)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumniResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody AlumniProfile profile) {

        AlumniProfile updatedProfile =
                alumniProfileService.updateProfile(id, profile);

        return ResponseEntity.ok(toResponse(updatedProfile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id) {

        alumniProfileService.deleteProfile(id);

        return ResponseEntity.noContent().build();
    }

    private AlumniResponse toResponse(AlumniProfile profile) {

        return new AlumniResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getUser().getRole(),
                profile.getGraduationYear(),
                profile.getCourse(),
                profile.getDepartment(),
                profile.getCompany(),
                profile.getJobRole(),
                profile.getLocation(),
                profile.getSkills(),
                profile.getLinkedinUrl(),
                profile.getBio()
        );
    }
}