package com.edunet.controller;

import com.edunet.dto.QuizDTO;
import com.edunet.dto.QuestionDTO;
import com.edunet.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quizzes")

public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody Map<String, Object> request) {
        Long courseId = Long.parseLong(request.get("courseId").toString());
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        Long professorId = Long.parseLong(request.get("professorId").toString());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> questionsData = (List<Map<String, Object>>) request.get("questions");
        List<QuestionDTO> questions = questionsData.stream().map(q -> QuestionDTO.builder()
                .question((String) q.get("question"))
                .options((List<String>) q.get("options"))
                .correctAnswer(Integer.parseInt(q.get("correctAnswer").toString()))
                .build()).toList();

        QuizDTO quiz = quizService.createQuiz(courseId, title, description, questions, professorId);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        QuizDTO quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizDTO>> getCourseQuizzes(@PathVariable Long courseId) {
        List<QuizDTO> quizzes = quizService.getCourseQuizzes(courseId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<QuizDTO>> getStudentQuizzes(@PathVariable Long studentId) {
        List<QuizDTO> quizzes = quizService.getStudentQuizzes(studentId);
        return ResponseEntity.ok(quizzes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
    // Adaugă această metodă în clasa QuizController:
    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<QuizDTO>> getProfessorQuizzes(@PathVariable Long professorId) {
        // Va trebui să creezi metoda și în QuizService (vezi mai jos)
        return ResponseEntity.ok(quizService.getProfessorQuizzes(professorId));
    }
}
