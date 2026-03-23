package com.chat.chatbackend.controller;

import com.chat.chatbackend.dto.MessageDTO;
import com.chat.chatbackend.dto.MessageResponseDTO;
import com.chat.chatbackend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public MessageResponseDTO sendMessage(MessageDTO messageDTO) {
        return messageService.saveMessage(messageDTO);
    }

    @GetMapping("/messages")
    public List<MessageResponseDTO> getMessages() {
        return messageService.getAllMessages();
    }
}
