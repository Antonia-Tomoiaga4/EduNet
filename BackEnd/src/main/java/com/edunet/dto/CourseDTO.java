package com.edunet.dto;

import com.edunet.entity.Course;
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
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String professorId;
    private String professorName;
    private List<CourseFileDTO> files;
    private String createdAt;

    public static CourseDTO from(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .professorId(course.getProfessor().getId().toString())
                .professorName(course.getProfessor().getName())
                // Verificare de siguranță pentru null:
                .createdAt(course.getCreatedAt() != null ? course.getCreatedAt().toString() : String.valueOf(System.currentTimeMillis()))
                .files(course.getFiles() != null ?
                        course.getFiles().stream().map(CourseFileDTO::from).collect(Collectors.toList()) :
                        List.of())
                .build();
    }
}
