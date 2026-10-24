package com.dpcadme.dto;

public class StudentResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String role;

    private String course;
    private String department;
    private Integer year;
    private String skills;
    private String bio;

    public StudentResponse(
            Long id,
            Long userId,
            String name,
            String email,
            String role,
            String course,
            String department,
            Integer year,
            String skills,
            String bio) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.course = course;
        this.department = department;
        this.year = year;
        this.skills = skills;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getCourse() {
        return course;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getYear() {
        return year;
    }

    public String getSkills() {
        return skills;
    }

    public String getBio() {
        return bio;
    }
}