package com.chat.chatbackend.service;

import com.chat.chatbackend.dto.MessageDTO;
import com.chat.chatbackend.dto.MessageResponseDTO;
import com.chat.chatbackend.model.Message;
import com.chat.chatbackend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageResponseDTO saveMessage(MessageDTO dto) {
        Message message = new Message();
        message.setSenderName(dto.getSenderName());
        message.setContent(dto.getContent());
        Message saved = messageRepository.save(message);
        return toResponse(saved);
    }

    public List<MessageResponseDTO> getAllMessages() {
        return messageRepository.findAllByOrderByTimestampAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponseDTO toResponse(Message msg) {
        MessageResponseDTO res = new MessageResponseDTO();
        res.setId(msg.getId());
        res.setSenderName(msg.getSenderName());
        res.setContent(msg.getContent());
        res.setTimestamp(msg.getTimestamp());
        return res;
    }
}
