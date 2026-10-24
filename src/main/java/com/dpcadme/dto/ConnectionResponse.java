package com.dpcadme.dto;

public class ConnectionResponse {

    private Long id;

    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long alumniId;
    private String alumniName;
    private String alumniEmail;

    private String status;

    public ConnectionResponse(
            Long id,
            Long studentId,
            String studentName,
            String studentEmail,
            Long alumniId,
            String alumniName,
            String alumniEmail,
            String status) {

        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.alumniId = alumniId;
        this.alumniName = alumniName;
        this.alumniEmail = alumniEmail;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public Long getAlumniId() {
        return alumniId;
    }

    public String getAlumniName() {
        return alumniName;
    }

    public String getAlumniEmail() {
        return alumniEmail;
    }

    public String getStatus() {
        return status;
    }
}