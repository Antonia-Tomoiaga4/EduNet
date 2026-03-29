package com.edunet.repository;

import com.edunet.entity.Assignment;
import com.edunet.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse(Course course);
    List<Assignment> findByCourseIn(List<Course> courses);
    List<Assignment> findByProfessorId(Long professorId);
}
