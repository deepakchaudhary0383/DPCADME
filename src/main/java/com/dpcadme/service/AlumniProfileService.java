package com.dpcadme.service;

import com.dpcadme.entity.AlumniProfile;
import com.dpcadme.repository.AlumniProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlumniProfileService {

    private final AlumniProfileRepository alumniProfileRepository;

    public AlumniProfileService(AlumniProfileRepository alumniProfileRepository) {
        this.alumniProfileRepository = alumniProfileRepository;
    }

    public AlumniProfile saveProfile(AlumniProfile profile) {
        return alumniProfileRepository.save(profile);
    }

    public List<AlumniProfile> getAllProfiles() {
        return alumniProfileRepository.findAll();
    }

    public List<AlumniProfile> searchByCompany(String company) {
        return alumniProfileRepository.findByCompanyContainingIgnoreCase(company);
    }

    public Optional<AlumniProfile> getProfileById(Long id) {
        return alumniProfileRepository.findById(id);
    }

    public Optional<AlumniProfile> getProfileByUserId(Long userId) {
        return alumniProfileRepository.findByUserId(userId);
    }

    public AlumniProfile updateProfile(Long id, AlumniProfile updatedProfile) {

        AlumniProfile existingProfile = alumniProfileRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));

        existingProfile.setGraduationYear(updatedProfile.getGraduationYear());
        existingProfile.setCourse(updatedProfile.getCourse());
        existingProfile.setDepartment(updatedProfile.getDepartment());
        existingProfile.setCompany(updatedProfile.getCompany());
        existingProfile.setJobRole(updatedProfile.getJobRole());
        existingProfile.setLocation(updatedProfile.getLocation());
        existingProfile.setSkills(updatedProfile.getSkills());
        existingProfile.setLinkedinUrl(updatedProfile.getLinkedinUrl());
        existingProfile.setBio(updatedProfile.getBio());

        return alumniProfileRepository.save(existingProfile);
    }

    public void deleteProfile(Long id) {
        alumniProfileRepository.deleteById(id);
    }
}