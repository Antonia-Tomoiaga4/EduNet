package com.edunet.service;

import com.edunet.dto.QuizResultDTO;
import com.edunet.entity.Question;
import com.edunet.entity.Quiz;
import com.edunet.entity.QuizResult;
import com.edunet.entity.User;
import com.edunet.repository.QuizRepository;
import com.edunet.repository.QuizResultRepository;
import com.edunet.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizResultService {

    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public QuizResultDTO submitQuizResult(Long quizId, Long studentId, List<Integer> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        QuizResult existing = quizResultRepository.findByQuizAndStudent(quiz, student).orElse(null);
        if (existing != null) {
            return toDto(existing, readAnswers(existing));
        }

        // Calculate score
        double score = 0;
        for (int i = 0; i < answers.size() && i < quiz.getQuestions().size(); i++) {
            Question q = quiz.getQuestions().get(i);
            if (answers.get(i) == q.getCorrectAnswer()) {
                score++;
            }
        }

        try {
            QuizResult result = QuizResult.builder()
                    .quiz(quiz)
                    .student(student)
                    .answers(objectMapper.writeValueAsString(answers))
                    .score(score)
                    .totalQuestions(quiz.getQuestions().size())
                    .build();

            quizResultRepository.save(result);

            return toDto(result, answers);
        } catch (Exception e) {
            throw new RuntimeException("Error saving quiz result", e);
        }
    }

    @Transactional(readOnly = true)
    public QuizResultDTO getStudentQuizResult(Long quizId, Long studentId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        QuizResult result = quizResultRepository.findByQuizAndStudent(quiz, student)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz result not found"));

        try {
            List<Integer> answers = readAnswers(result);
            return toDto(result, answers);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving quiz result", e);
        }
    }

    @Transactional(readOnly = true)
    public List<QuizResultDTO> getQuizResultsByQuizId(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        return quizResultRepository.findByQuiz(quiz).stream()
                .map(result -> toDto(result, null))
                .collect(Collectors.toList());
    }

    private List<Integer> readAnswers(QuizResult result) {
        try {
            return objectMapper.readValue(result.getAnswers(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Integer.class));
        } catch (Exception e) {
            throw new RuntimeException("Error reading answers", e);
        }
    }

    private QuizResultDTO toDto(QuizResult result, List<Integer> answers) {
        return QuizResultDTO.builder()
                .quizId(result.getQuiz().getId())
                .studentId(result.getStudent().getId().toString())
                .studentName(result.getStudent().getName())
                .answers(answers)
                .score(result.getScore())
                .totalQuestions(result.getTotalQuestions())
                .completedAt(result.getCompletedAt().toString())
                .build();
    }
}
