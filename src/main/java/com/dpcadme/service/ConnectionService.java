package com.dpcadme.service;

import com.dpcadme.entity.Connection;
import com.dpcadme.repository.ConnectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.dpcadme.entity.StudentProfile;
import com.dpcadme.entity.AlumniProfile;
import com.dpcadme.repository.StudentProfileRepository;
import com.dpcadme.repository.AlumniProfileRepository;
import java.time.LocalDateTime;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AlumniProfileRepository alumniProfileRepository;

   public ConnectionService(
            ConnectionRepository connectionRepository,
            StudentProfileRepository studentProfileRepository,
            AlumniProfileRepository alumniProfileRepository) {

        this.connectionRepository = connectionRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.alumniProfileRepository = alumniProfileRepository;
    }

    public Connection saveConnection(Connection connection) {
        return connectionRepository.save(connection);
    }

    public List<Connection> getAllConnections() {
        return connectionRepository.findAll();
    }

    public Optional<Connection> getConnectionById(Long id) {
        return connectionRepository.findById(id);
    }

        public List<Connection> getConnectionsByStudent(Long studentId) {
        return connectionRepository.findByStudentId(studentId);
    }

    public List<Connection> getConnectionsByAlumni(Long alumniId) {
        return connectionRepository.findByAlumniId(alumniId);
    }

    public List<Connection> getConnectionsByStatus(String status) {
        return connectionRepository.findByStatus(status);
    }

    public Connection sendRequest(Long studentId, Long alumniId) {

        StudentProfile student = studentProfileRepository
                .findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        AlumniProfile alumni = alumniProfileRepository
                .findById(alumniId)
                .orElseThrow(() ->
                        new RuntimeException("Alumni not found"));

        Optional<Connection> existingConnection =
                connectionRepository.findByStudentIdAndAlumniId(
                        studentId,
                        alumniId
                );

        if (existingConnection.isPresent()) {

            Connection existing = existingConnection.get();

            if ("PENDING".equals(existing.getStatus())) {
                throw new RuntimeException(
                        "A connection request is already pending."
                );
            }

            if ("ACCEPTED".equals(existing.getStatus())) {
                throw new RuntimeException(
                        "You are already connected with this alumni."
                );
            }

            if ("REJECTED".equals(existing.getStatus())) {
                existing.setStatus("PENDING");
                existing.setCreatedAt(LocalDateTime.now());

                return connectionRepository.save(existing);
            }
        }

        Connection connection = new Connection();

        connection.setStudent(student);
        connection.setAlumni(alumni);
        connection.setStatus("PENDING");
        connection.setCreatedAt(LocalDateTime.now());

        return connectionRepository.save(connection);
    }

    public Connection acceptRequest(Long id) {

        Connection connection = connectionRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        connection.setStatus("ACCEPTED");

        return connectionRepository.save(connection);
    }

    public Connection rejectRequest(Long id) {

        Connection connection = connectionRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        connection.setStatus("REJECTED");

        return connectionRepository.save(connection);
    }

    public void deleteConnection(Long id) {
        connectionRepository.deleteById(id);
    }
}