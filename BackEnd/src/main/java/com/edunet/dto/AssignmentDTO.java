package com.edunet.dto;

import com.edunet.entity.Assignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {
    private Long id;
    private String courseId;
    private String courseName;
    private String title;
    private String description;
    private String dueDate;
    private String professorId;
    private List<SubmissionDTO> submissions;

    public static AssignmentDTO from(Assignment assignment) {
        return AssignmentDTO.builder()
                .id(assignment.getId())
                .courseId(assignment.getCourse().getId().toString())
                .courseName(assignment.getCourse().getTitle())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate().toString())
                .professorId(assignment.getProfessor().getId().toString())
                .submissions(assignment.getSubmissions() != null ? 
                    assignment.getSubmissions().stream().map(SubmissionDTO::from).collect(Collectors.toList()) : 
                    List.of())
                .build();
    }
}
