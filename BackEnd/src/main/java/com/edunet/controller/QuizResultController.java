package com.edunet.controller;

import com.edunet.dto.QuizResultDTO;
import com.edunet.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quiz-results")

public class QuizResultController {

    @Autowired
    private QuizResultService quizResultService;

    @PostMapping
    public ResponseEntity<QuizResultDTO> submitQuizResult(@RequestBody Map<String, Object> request) {
        Long quizId = ((Number) request.get("quizId")).longValue();
        Long studentId = ((Number) request.get("studentId")).longValue();
        @SuppressWarnings("unchecked")
        List<Integer> answers = (List<Integer>) request.get("answers");

        QuizResultDTO result = quizResultService.submitQuizResult(quizId, studentId, answers);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{quizId}/student/{studentId}")
    public ResponseEntity<QuizResultDTO> getStudentQuizResult(@PathVariable Long quizId, @PathVariable Long studentId) {
        QuizResultDTO result = quizResultService.getStudentQuizResult(quizId, studentId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizResultDTO>> getQuizResults(@PathVariable Long quizId) {
        List<QuizResultDTO> results = quizResultService.getQuizResultsByQuizId(quizId);
        return ResponseEntity.ok(results);
    }
}
