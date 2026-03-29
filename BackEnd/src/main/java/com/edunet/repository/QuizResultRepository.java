package com.edunet.repository;

import com.edunet.entity.QuizResult;
import com.edunet.entity.Quiz;
import com.edunet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByQuiz(Quiz quiz);
    Optional<QuizResult> findByQuizAndStudent(Quiz quiz, User student);
    List<QuizResult> findByStudent(User student);
}
