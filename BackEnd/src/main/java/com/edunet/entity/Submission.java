package com.edunet.entity;

import com.edunet.entity.Assignment;
import com.edunet.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Long submittedAt;

    private Double grade;
    private String feedback;

    // Această metodă se execută automat fix înainte de salvarea în baza de date
    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = System.currentTimeMillis();
        }
    }
}
