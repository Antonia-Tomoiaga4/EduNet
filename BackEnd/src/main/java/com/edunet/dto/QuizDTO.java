package com.edunet.dto;

import com.edunet.entity.Quiz;
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
public class QuizDTO {
    private Long id;
    private String courseId;
    private String courseName;
    private String title;
    private String description;
    private List<QuestionDTO> questions;
    private String professorId;
    private String createdAt;

    public static QuizDTO from(Quiz quiz) {
        return QuizDTO.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse().getId().toString())
                .courseName(quiz.getCourse().getTitle())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .questions(quiz.getQuestions() != null ? 
                    quiz.getQuestions().stream().map(q -> {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        try {
                            List<String> options = mapper.readValue(q.getOptions(), 
                                mapper.getTypeFactory().constructCollectionType(List.class, String.class));
                            return QuestionDTO.builder()
                                    .id(q.getId())
                                    .question(q.getQuestion())
                                    .options(options)
                                    .correctAnswer(q.getCorrectAnswer())
                                    .build();
                        } catch (Exception e) {
                            return null;
                        }
                    }).collect(Collectors.toList()) : 
                    List.of())
                .professorId(quiz.getProfessor().getId().toString())
                .createdAt(quiz.getCreatedAt().toString())
                .build();
    }
}
