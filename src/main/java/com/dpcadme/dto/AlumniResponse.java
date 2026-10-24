package com.dpcadme.dto;

public class AlumniResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String role;

    private Integer graduationYear;
    private String course;
    private String department;
    private String company;
    private String jobRole;
    private String location;
    private String skills;
    private String linkedinUrl;
    private String bio;

    public AlumniResponse(
            Long id,
            Long userId,
            String name,
            String email,
            String role,
            Integer graduationYear,
            String course,
            String department,
            String company,
            String jobRole,
            String location,
            String skills,
            String linkedinUrl,
            String bio) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.graduationYear = graduationYear;
        this.course = course;
        this.department = department;
        this.company = company;
        this.jobRole = jobRole;
        this.location = location;
        this.skills = skills;
        this.linkedinUrl = linkedinUrl;
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

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public String getCourse() {
        return course;
    }

    public String getDepartment() {
        return department;
    }

    public String getCompany() {
        return company;
    }

    public String getJobRole() {
        return jobRole;
    }

    public String getLocation() {
        return location;
    }

    public String getSkills() {
        return skills;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getBio() {
        return bio;
    }
}