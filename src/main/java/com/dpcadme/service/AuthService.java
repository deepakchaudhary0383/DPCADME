package com.dpcadme.service;

import com.dpcadme.entity.AlumniProfile;
import com.dpcadme.entity.StudentProfile;
import com.dpcadme.entity.User;
import com.dpcadme.repository.AlumniProfileRepository;
import com.dpcadme.repository.StudentProfileRepository;
import com.dpcadme.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentProfileRepository studentProfileRepository;
    private final AlumniProfileRepository alumniProfileRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            StudentProfileRepository studentProfileRepository,
            AlumniProfileRepository alumniProfileRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentProfileRepository = studentProfileRepository;
        this.alumniProfileRepository = alumniProfileRepository;
    }
    
    @Transactional
    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        if ("STUDENT".equalsIgnoreCase(savedUser.getRole())) {

            StudentProfile profile = new StudentProfile();

            profile.setUser(savedUser);

            studentProfileRepository.save(profile);

        } else if ("ALUMNI".equalsIgnoreCase(savedUser.getRole())) {

            AlumniProfile profile = new AlumniProfile();

            profile.setUser(savedUser);

            alumniProfileRepository.save(profile);
        }

        return savedUser;
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}