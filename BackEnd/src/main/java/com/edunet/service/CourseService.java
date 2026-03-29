package com.edunet.service;

import com.edunet.dto.CourseDTO;
import com.edunet.dto.CourseFileDTO;
import com.edunet.entity.Course;
import com.edunet.entity.CourseFile;
import com.edunet.entity.User;
import com.edunet.repository.CourseFileRepository;
import com.edunet.repository.CourseRepository;
import com.edunet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseFileRepository courseFileRepository;

    public CourseDTO createCourse(String title, String description, Long professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (professor.getRole() != User.UserRole.PROFESSOR) {
            throw new RuntimeException("Only professors can create courses");
        }

        Course course = Course.builder()
                .title(title)
                .description(description)
                .professor(professor)
                .build();

        courseRepository.save(course);
        return CourseDTO.from(course);
    }

    public List<CourseDTO> getProfessorCourses(Long professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return courseRepository.findByProfessor(professor).stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getStudentCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return courseRepository.findByStudentsContaining(student).stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findWithFilesById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return CourseDTO.from(course);
    }

    public CourseDTO updateCourse(Long courseId, String title, String description) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (title != null && !title.isBlank()) {
            course.setTitle(title);
        }
        if (description != null) {
            course.setDescription(description);
        }
        Course saved = courseRepository.save(course);
        return CourseDTO.from(saved);
    }

    public CourseFileDTO addCourseFile(Long courseId, String name, String url, String size) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseFile file = CourseFile.builder()
                .course(course)
                .name(name)
                .url(url)
                .size(size != null && !size.isBlank() ? size : "N/A")
                .build();
        CourseFile saved = courseFileRepository.save(file);
        return CourseFileDTO.from(saved);
    }

    public CourseFileDTO addCourseFileUpload(Long courseId, MultipartFile multipartFile) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String originalName = multipartFile.getOriginalFilename();
        String safeName = originalName != null ? Paths.get(originalName).getFileName().toString() : "file";
        String storedName = System.currentTimeMillis() + "-" + UUID.randomUUID() + "-" + safeName;

        Path uploadDir = Paths.get("uploads");
        Files.createDirectories(uploadDir);
        Path targetPath = uploadDir.resolve(storedName);
        Files.copy(multipartFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String size = formatSize(multipartFile.getSize());
        String url = "/api/files/" + storedName;

        CourseFile file = CourseFile.builder()
                .course(course)
                .name(safeName)
                .url(url)
                .size(size)
                .build();
        CourseFile saved = courseFileRepository.save(file);
        return CourseFileDTO.from(saved);
    }

    public void deleteCourseFile(Long fileId) throws IOException {
        CourseFile file = courseFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        String url = file.getUrl();
        if (url != null && url.startsWith("/api/files/")) {
            String relativePath = url.replace("/api/files/", "");
            Path target = Paths.get("uploads").resolve(relativePath);
            Files.deleteIfExists(target);
        }
        courseFileRepository.delete(file);
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }
        double kb = bytes / 1024.0;
        if (kb < 1024) {
            return String.format("%.1f KB", kb);
        }
        double mb = kb / 1024.0;
        if (mb < 1024) {
            return String.format("%.1f MB", mb);
        }
        double gb = mb / 1024.0;
        return String.format("%.1f GB", gb);
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    public CourseDTO enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getRole() != User.UserRole.STUDENT) {
            throw new RuntimeException("Only students can enroll");
        }

        if (!course.getStudents().contains(student)) {
            course.getStudents().add(student);
            courseRepository.save(course);
        }

        return CourseDTO.from(course);
    }

    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
}
