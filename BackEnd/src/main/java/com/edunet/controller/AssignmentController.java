package com.edunet.controller;

import com.edunet.dto.AssignmentDTO;
import com.edunet.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assignments")

public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentDTO> createAssignment(@RequestBody AssignmentDTO dto) {
        // Conversie sigură din String în Long, deoarece în DTO-ul tău ID-urile sunt String
        Long courseId = Long.valueOf(dto.getCourseId());
        Long professorId = Long.valueOf(dto.getProfessorId());

        // Pentru data limită, React trimite un timestamp sub formă de String
        Long dueDate = Long.valueOf(dto.getDueDate());

        AssignmentDTO assignment = assignmentService.createAssignment(
                courseId,
                dto.getTitle(),
                dto.getDescription(),
                dueDate,
                professorId
        );
        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long id) {
        AssignmentDTO assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentDTO>> getCourseAssignments(@PathVariable Long courseId) {
        List<AssignmentDTO> assignments = assignmentService.getCourseAssignments(courseId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssignmentDTO>> getStudentAssignments(@PathVariable Long studentId) {
        List<AssignmentDTO> assignments = assignmentService.getStudentAssignments(studentId);
        return ResponseEntity.ok(assignments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
    // Adaugă această metodă în clasa AssignmentController:
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<AssignmentDTO>> getProfessorAssignments(@PathVariable Long professorId) {
        return ResponseEntity.ok(assignmentService.getProfessorAssignments(professorId));
    }
}
