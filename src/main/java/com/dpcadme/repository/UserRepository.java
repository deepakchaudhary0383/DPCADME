package com.dpcadme.repository;

import com.dpcadme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRoleIgnoreCase(String role);

    List<User> findByRoleIgnoreCaseAndNameContainingIgnoreCase(
            String role,
            String name
    );

    List<User> findByRoleIgnoreCaseAndEmailContainingIgnoreCase(
            String role,
            String email
    );

    long countByRoleIgnoreCase(String role);
}