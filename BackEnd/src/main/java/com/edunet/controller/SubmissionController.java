package com.edunet.controller;

import com.edunet.dto.SubmissionDTO;
import com.edunet.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/submissions")

public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionDTO> createSubmission(@RequestBody Map<String, Object> request) {
        // Conversie sigura: transformam in String, apoi in Long
        Long assignmentId = Long.parseLong(request.get("assignmentId").toString());
        Long studentId = Long.parseLong(request.get("studentId").toString());
        String content = (String) request.get("content");
        String fileName = request.get("fileName") != null ? request.get("fileName").toString() : null;
        String fileUrl = request.get("fileUrl") != null ? request.get("fileUrl").toString() : null;

        SubmissionDTO submission = submissionService.createSubmission(assignmentId, studentId, content, fileName, fileUrl);
        return ResponseEntity.ok(submission);
    }

    @PostMapping("/upload")
    public ResponseEntity<SubmissionDTO> uploadSubmission(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        SubmissionDTO submission = submissionService.uploadSubmissionFile(assignmentId, studentId, file);
        return ResponseEntity.ok(submission);
    }

    @PostMapping("/{submissionId}/grade")
    public ResponseEntity<SubmissionDTO> gradeSubmission(@PathVariable Long submissionId, @RequestBody Map<String, Object> request) {
        // Conversie sigura pentru Double (nota)
        Double grade = Double.parseDouble(request.get("grade").toString());
        String feedback = (String) request.get("feedback");

        SubmissionDTO submission = submissionService.gradeSubmission(submissionId, grade, feedback);
        return ResponseEntity.ok(submission);
    }

    // Metodele de GET raman neschimbate
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<SubmissionDTO>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getAssignmentSubmissions(assignmentId));
    }
}
