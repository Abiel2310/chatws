package org.example.chatws.controller;
<<<<<<< HEAD
import org.example.chatws.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
=======

import org.springframework.stereotype.Controller;
import org.example.chatws.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
>>>>>>> Abiel/main

@Controller 
public class ChatController {
    
<<<<<<< HEAD
    @MessageMapping ("/chat.sendMessage")
    @SendTo ("/topic/public")
    public ChatMessage enviarMensaje(ChatMessage mensaje) {
        System.out.println("Mensaje recibido: " + mensaje);
=======
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage enviarMensaje(ChatMessage mensaje) {
>>>>>>> Abiel/main
        return mensaje;
    }

    @MessageMapping ("/chat.addUser")
<<<<<<< HEAD
    @SendTo ("/topic/public")
    public ChatMessage agregarUsuario(ChatMessage mensaje) {
        System.out.println("Usuario agregado: " + mensaje);
=======
    @SendTo("/topic/public")
    public ChatMessage agregarUsuario(ChatMessage mensaje) {
>>>>>>> Abiel/main
        return mensaje;
    }
}
