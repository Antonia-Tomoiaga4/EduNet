package com.edunet.service;

import com.edunet.dto.QuizDTO;
import com.edunet.dto.QuestionDTO;
import com.edunet.entity.Course;
import com.edunet.entity.Question;
import com.edunet.entity.Quiz;
import com.edunet.entity.User;
import com.edunet.repository.CourseRepository;
import com.edunet.repository.QuizRepository;
import com.edunet.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuizDTO createQuiz(Long courseId, String title, String description, List<QuestionDTO> questions, Long professorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        Quiz quiz = Quiz.builder()
                .course(course)
                .title(title)
                .description(description)
                .professor(professor)
                .questions(new ArrayList<>())
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);

        for (QuestionDTO qDto : questions) {
            try {
                Question q = Question.builder()
                        .quiz(savedQuiz)
                        .question(qDto.getQuestion())
                        .options(objectMapper.writeValueAsString(qDto.getOptions()))
                        .correctAnswer(qDto.getCorrectAnswer())
                        .build();
                savedQuiz.getQuestions().add(q);
            } catch (Exception e) {
                throw new RuntimeException("Error creating question", e);
            }
        }

        quizRepository.save(savedQuiz);
        return QuizDTO.from(savedQuiz);
    }

    public List<QuizDTO> getCourseQuizzes(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return quizRepository.findByCourse(course).stream()
                .map(QuizDTO::from)
                .collect(Collectors.toList());
    }

    public List<QuizDTO> getStudentQuizzes(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<Course> enrolledCourses = courseRepository.findByStudentsContaining(student);
        return quizRepository.findByCourseIn(enrolledCourses).stream()
                .map(QuizDTO::from)
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return QuizDTO.from(quiz);
    }
    // Adaugă această metodă în QuizService:
    public List<QuizDTO> getProfessorQuizzes(Long professorId) {
        // Presupunând că ai metoda findByProfessorId în QuizRepository
        return quizRepository.findByProfessorId(professorId)
                .stream()
                .map(QuizDTO::from)
                .toList();
    }
    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }
}
