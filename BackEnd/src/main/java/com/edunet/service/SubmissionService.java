package com.edunet.service;

import com.edunet.dto.SubmissionDTO;
import com.edunet.entity.Assignment;
import com.edunet.entity.Submission;
import com.edunet.entity.User;
import com.edunet.repository.AssignmentRepository;
import com.edunet.repository.SubmissionRepository;
import com.edunet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    public SubmissionDTO createSubmission(Long assignmentId, Long studentId, String content, String fileName, String fileUrl) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<Submission> existing = submissionRepository.findByAssignmentAndStudent(assignment, student);
        Submission submission = existing.orElseGet(() -> Submission.builder()
                .assignment(assignment)
                .student(student)
                .build());

        submission.setContent(content);
        submission.setFileName(fileName);
        submission.setFileUrl(fileUrl);
        submission.setSubmittedAt(System.currentTimeMillis());
        submissionRepository.save(submission);
        return SubmissionDTO.from(submission);
    }

    public List<SubmissionDTO> getAssignmentSubmissions(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return submissionRepository.findByAssignment(assignment).stream()
                .map(SubmissionDTO::from)
                .collect(Collectors.toList());
    }

    public SubmissionDTO getStudentSubmission(Long assignmentId, Long studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Submission submission = submissionRepository.findByAssignmentAndStudent(assignment, student)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return SubmissionDTO.from(submission);
    }

    public SubmissionDTO gradeSubmission(Long submissionId, Double grade, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submissionRepository.save(submission);
        return SubmissionDTO.from(submission);
    }

    public SubmissionDTO uploadSubmissionFile(Long assignmentId, Long studentId, MultipartFile multipartFile) throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String originalName = multipartFile.getOriginalFilename();
        String safeName = originalName != null ? Paths.get(originalName).getFileName().toString() : "file";
        String storedName = System.currentTimeMillis() + "-" + UUID.randomUUID() + "__" + safeName;

        Path uploadDir = Paths.get("uploads", "submissions");
        Files.createDirectories(uploadDir);
        Path targetPath = uploadDir.resolve(storedName);
        Files.copy(multipartFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        Optional<Submission> existing = submissionRepository.findByAssignmentAndStudent(assignment, student);
        Submission submission = existing.orElseGet(() -> Submission.builder()
                .assignment(assignment)
                .student(student)
                .build());

        submission.setContent(storedName);
        submission.setSubmittedAt(System.currentTimeMillis());
        submissionRepository.save(submission);
        return SubmissionDTO.from(submission);
    }
}
