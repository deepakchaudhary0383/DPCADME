package com.dpcadme.service;

import com.dpcadme.entity.StudentProfile;
import com.dpcadme.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    public StudentProfile saveProfile(StudentProfile profile) {
        return studentProfileRepository.save(profile);
    }

    public List<StudentProfile> getAllProfiles() {
        return studentProfileRepository.findAll();
    }

    public Optional<StudentProfile> getProfileById(Long id) {
        return studentProfileRepository.findById(id);
    }

    public Optional<StudentProfile> getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId);
    }

    public void deleteProfile(Long id) {
        studentProfileRepository.deleteById(id);
    }
}