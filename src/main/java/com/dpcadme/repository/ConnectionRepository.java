package com.dpcadme.repository;

import com.dpcadme.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    List<Connection> findByStudentId(Long studentId);

    List<Connection> findByAlumniId(Long alumniId);

    List<Connection> findByStatus(String status);

    Optional<Connection> findByStudentIdAndAlumniId(
            Long studentId,
            Long alumniId);
}