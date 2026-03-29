package com.edunet.repository;

import com.edunet.entity.Quiz;
import com.edunet.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourse(Course course);
    List<Quiz> findByCourseIn(List<Course> courses);
    List<Quiz> findByProfessorId(Long professorId);
}
