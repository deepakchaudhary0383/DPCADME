package com.dpcadme.controller;

import com.dpcadme.dto.ConnectionResponse;
import com.dpcadme.entity.Connection;
import com.dpcadme.service.ConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping
    public ResponseEntity<ConnectionResponse> createConnection(
            @RequestBody Connection connection) {

        Connection savedConnection =
                connectionService.saveConnection(connection);

        return ResponseEntity.ok(toResponse(savedConnection));
    }

    @PostMapping("/request")
    public ResponseEntity<ConnectionResponse> sendRequest(
            @RequestParam Long studentId,
            @RequestParam Long alumniId) {

        Connection connection =
                connectionService.sendRequest(studentId, alumniId);

        return ResponseEntity.ok(toResponse(connection));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionResponse> acceptRequest(
            @PathVariable Long id) {

        Connection connection =
                connectionService.acceptRequest(id);

        return ResponseEntity.ok(toResponse(connection));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ConnectionResponse> rejectRequest(
            @PathVariable Long id) {

        Connection connection =
                connectionService.rejectRequest(id);

        return ResponseEntity.ok(toResponse(connection));
    }

    @GetMapping
    public ResponseEntity<List<ConnectionResponse>> getAllConnections() {

        List<ConnectionResponse> responses =
                connectionService.getAllConnections()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ConnectionResponse>> getByStudent(
            @PathVariable Long studentId) {

        List<ConnectionResponse> responses =
                connectionService.getConnectionsByStudent(studentId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<List<ConnectionResponse>> getByAlumni(
            @PathVariable Long alumniId) {

        List<ConnectionResponse> responses =
                connectionService.getConnectionsByAlumni(alumniId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ConnectionResponse>> getByStatus(
            @PathVariable String status) {

        List<ConnectionResponse> responses =
                connectionService.getConnectionsByStatus(status)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConnectionResponse> getConnectionById(
            @PathVariable Long id) {

        return connectionService.getConnectionById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConnection(
            @PathVariable Long id) {

        connectionService.deleteConnection(id);

        return ResponseEntity.noContent().build();
    }

    private ConnectionResponse toResponse(Connection connection) {

        return new ConnectionResponse(
                connection.getId(),

                connection.getStudent().getId(),
                connection.getStudent().getUser().getName(),
                connection.getStudent().getUser().getEmail(),

                connection.getAlumni().getId(),
                connection.getAlumni().getUser().getName(),
                connection.getAlumni().getUser().getEmail(),

                connection.getStatus()
        );
    }
}