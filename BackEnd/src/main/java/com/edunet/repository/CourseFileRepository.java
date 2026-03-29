package com.edunet.repository;

import com.edunet.entity.CourseFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseFileRepository extends JpaRepository<CourseFile, Long> {
}
