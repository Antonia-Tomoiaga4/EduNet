package com.edunet.dto;

import com.edunet.entity.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionDTO {
    private Long id;
    private String studentId;
    private String studentName;
    private String content;
    private String fileName;
    private String fileUrl;
    private String submittedAt;
    private Double grade;
    private String feedback;

    public static SubmissionDTO from(Submission submission) {
        String content = submission.getContent();
        String fileName = submission.getFileName();
        String fileUrl = submission.getFileUrl();
        if ((fileName == null || fileUrl == null) && content != null && content.contains("__")) {
            int markerIndex = content.indexOf("__");
            if (markerIndex >= 0 && markerIndex + 2 < content.length()) {
                fileName = fileName == null ? content.substring(markerIndex + 2) : fileName;
                fileUrl = fileUrl == null ? "/api/files/submissions/" + content : fileUrl;
            }
        }
        return SubmissionDTO.builder()
                .id(submission.getId())
                .studentId(submission.getStudent().getId().toString())
                .studentName(submission.getStudent().getName())
                .content(content)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .submittedAt(submission.getSubmittedAt().toString())
                .grade(submission.getGrade())
                .feedback(submission.getFeedback())
                .build();
    }
}
