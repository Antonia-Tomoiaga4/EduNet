package com.edunet.dto;

import com.edunet.entity.CourseFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseFileDTO {
    private Long id;
    private String name;
    private String url;
    private String size;

    public static CourseFileDTO from(CourseFile file) {
        return CourseFileDTO.builder()
                .id(file.getId())
                .name(file.getName())
                .url(file.getUrl())
                .size(file.getSize())
                .build();
    }
}
