package com.edunet.controller;

import com.edunet.dto.CourseDTO;
import com.edunet.dto.CourseFileDTO;
import com.edunet.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")

public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        // Conversie sigură prin String pentru a evita crash-ul la ID-uri text/numerice
        Long professorId = Long.parseLong(request.get("professorId").toString());

        CourseDTO course = courseService.createCourse(title, description, professorId);
        return ResponseEntity.ok(course);
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        CourseDTO course = courseService.updateCourse(id, title, description);
        return ResponseEntity.ok(course);
    }

    @PostMapping("/{courseId}/files")
    public ResponseEntity<CourseFileDTO> addCourseFile(@PathVariable Long courseId, @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String url = (String) request.get("url");
        String size = request.get("size") != null ? request.get("size").toString() : null;
        CourseFileDTO file = courseService.addCourseFile(courseId, name, url, size);
        return ResponseEntity.ok(file);
    }

    @PostMapping("/{courseId}/files/upload")
    public ResponseEntity<CourseFileDTO> uploadCourseFile(@PathVariable Long courseId, @RequestParam("file") MultipartFile file) throws IOException {
        CourseFileDTO saved = courseService.addCourseFileUpload(courseId, file);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteCourseFile(@PathVariable Long fileId) throws IOException {
        courseService.deleteCourseFile(fileId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<CourseDTO>> getProfessorCourses(@PathVariable Long professorId) {
        List<CourseDTO> courses = courseService.getProfessorCourses(professorId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseDTO>> getStudentCourses(@PathVariable Long studentId) {
        List<CourseDTO> courses = courseService.getStudentCourses(studentId);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<CourseDTO> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        CourseDTO course = courseService.enrollStudent(courseId, studentId);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
