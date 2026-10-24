package com.dpcadme.repository;

import com.dpcadme.entity.AlumniProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {

    List<AlumniProfile> findByCompanyContainingIgnoreCase(String company);

    Optional<AlumniProfile> findByUserId(Long userId);
}