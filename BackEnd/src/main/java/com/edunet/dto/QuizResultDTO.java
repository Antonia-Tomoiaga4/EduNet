package com.edunet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDTO {
    private Long quizId;
    private String studentId;
    private String studentName;
    private List<Integer> answers;
    private Double score;
    private Integer totalQuestions;
    private String completedAt;
}
