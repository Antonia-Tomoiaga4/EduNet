package com.edunet.service;

import com.edunet.dto.AssignmentDTO;
import com.edunet.entity.Assignment;
import com.edunet.entity.Course;
import com.edunet.entity.User;
import com.edunet.repository.AssignmentRepository;
import com.edunet.repository.CourseRepository;
import com.edunet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public AssignmentDTO createAssignment(Long courseId, String title, String description, Long dueDate, Long professorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        Assignment assignment = Assignment.builder()
                .course(course)
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .professor(professor)
                .build();

        assignmentRepository.save(assignment);
        return AssignmentDTO.from(assignment);
    }

    public List<AssignmentDTO> getCourseAssignments(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return assignmentRepository.findByCourse(course).stream()
                .map(AssignmentDTO::from)
                .collect(Collectors.toList());
    }

    public List<AssignmentDTO> getStudentAssignments(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        List<Course> enrolledCourses = courseRepository.findByStudentsContaining(student);
        return assignmentRepository.findByCourseIn(enrolledCourses).stream()
                .map(AssignmentDTO::from)
                .collect(Collectors.toList());
    }

    public AssignmentDTO getAssignmentById(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return AssignmentDTO.from(assignment);
    }
    public List<AssignmentDTO> getProfessorAssignments(Long professorId) {
        return assignmentRepository.findByProfessorId(professorId)
                .stream().map(AssignmentDTO::from).toList();
    }
    public void deleteAssignment(Long assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }
}
