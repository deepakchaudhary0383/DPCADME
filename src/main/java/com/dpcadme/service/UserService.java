package com.dpcadme.service;

import com.dpcadme.entity.User;
import com.dpcadme.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public UserService(
            UserRepository userRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // Create user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get all students
    public List<User> getAllStudents() {
        return userRepository.findByRoleIgnoreCase("STUDENT");
    }

    // Get all alumni
    public List<User> getAllAlumni() {
        return userRepository.findByRoleIgnoreCase("ALUMNI");
    }

    // Search students
    public List<User> searchStudents(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }

        String search = keyword.trim();

        List<User> studentsByName =
                userRepository.findByRoleIgnoreCaseAndNameContainingIgnoreCase(
                        "STUDENT", search
                );

        List<User> studentsByEmail =
                userRepository.findByRoleIgnoreCaseAndEmailContainingIgnoreCase(
                        "STUDENT", search
                );

        return Stream.concat(
                        studentsByName.stream(),
                        studentsByEmail.stream()
                )
                .collect(Collectors.toMap(
                        User::getId,
                        user -> user,
                        (existing, duplicate) -> existing
                ))
                .values()
                .stream()
                .toList();
    }

    // Search alumni
    public List<User> searchAlumni(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllAlumni();
        }

        String search = keyword.trim();

        List<User> alumniByName =
                userRepository.findByRoleIgnoreCaseAndNameContainingIgnoreCase(
                        "ALUMNI", search
                );

        List<User> alumniByEmail =
                userRepository.findByRoleIgnoreCaseAndEmailContainingIgnoreCase(
                        "ALUMNI", search
                );

        return Stream.concat(
                        alumniByName.stream(),
                        alumniByEmail.stream()
                )
                .collect(Collectors.toMap(
                        User::getId,
                        user -> user,
                        (existing, duplicate) -> existing
                ))
                .values()
                .stream()
                .toList();
    }

    // Count students
    public long getStudentCount() {
        return userRepository.countByRoleIgnoreCase("STUDENT");
    }

    // Count alumni
    public long getAlumniCount() {
        return userRepository.countByRoleIgnoreCase("ALUMNI");
    }

    // Delete user and all associated profiles and connections
    @Transactional
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }

        // 1. Delete connections that reference this user's profiles.
        jdbcTemplate.update(
                "DELETE FROM connections " +
                "WHERE student_id IN " +
                "(SELECT id FROM student_profiles WHERE user_id = ?) " +
                "OR alumni_id IN " +
                "(SELECT id FROM alumni_profiles WHERE user_id = ?)",
                id, id
        );

        // 2. Delete student profile, if present.
        jdbcTemplate.update(
                "DELETE FROM student_profiles WHERE user_id = ?",
                id
        );

        // 3. Delete alumni profile, if present.
        jdbcTemplate.update(
                "DELETE FROM alumni_profiles WHERE user_id = ?",
                id
        );

        // 4. Delete the user account.
        jdbcTemplate.update(
                "DELETE FROM users WHERE id = ?",
                id
        );
    }
}