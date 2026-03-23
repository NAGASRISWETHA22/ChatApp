package com.chat.chatbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponseDTO {
    private Long id;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;
}
