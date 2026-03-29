package com.edunet.repository;

import com.edunet.entity.Course;
import com.edunet.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @EntityGraph(attributePaths = "files")
    List<Course> findByProfessor(User professor);
    @EntityGraph(attributePaths = "files")
    List<Course> findByStudentsContaining(User student);
    @Override
    @EntityGraph(attributePaths = "files")
    List<Course> findAll();

    @EntityGraph(attributePaths = "files")
    Optional<Course> findWithFilesById(Long id);
}
