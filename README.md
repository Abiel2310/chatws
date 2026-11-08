# Chat WebSocket - Guía para Alumnos

Este proyecto implementa un chat en tiempo real con **WebSocket**, **STOMP** y Spring Boot. RabbitMQ actúa como broker de mensajes: recibe y distribuye los mensajes entre los clientes conectados.

## 📝 Descripción del Proyecto

ChatWS es una aplicación de chat en tiempo real que permite a múltiples usuarios conectarse, enviar mensajes y recibir actualizaciones instantáneas sin necesidad de recargar la página. Utiliza una arquitectura basada en eventos donde los mensajes se propagan automáticamente a todos los clientes conectados.

**Tecnologías principales:**
- Spring Boot 4.1.1
- WebSocket para comunicación bidireccional
- STOMP como protocolo de mensajería
- RabbitMQ como broker STOMP externo
- SockJS para compatibilidad con navegadores antiguos
- Jackson para serialización JSON

---

## RabbitMQ en Windows (Docker)

Necesitas tener Docker Desktop iniciado. En PowerShell, crea el broker con un usuario de desarrollo:

```powershell
docker run -d --name chatws-rabbitmq `
  -p 5672:5672 -p 61613:61613 -p 15672:15672 `
  -e RABBITMQ_DEFAULT_USER=chatws `
  -e RABBITMQ_DEFAULT_PASS=chatws `
  rabbitmq:4-management
```

Espera a que RabbitMQ termine de iniciar; puedes comprobarlo con `docker logs chatws-rabbitmq`. Luego habilita STOMP e inicia la aplicación:

```powershell
docker exec chatws-rabbitmq rabbitmq-plugins enable rabbitmq_stomp
$env:RABBITMQ_USERNAME = "chatws"
$env:RABBITMQ_PASSWORD = "chatws"
.\mvnw.cmd spring-boot:run
```

RabbitMQ usa `5672` para AMQP y `61613` para STOMP. El puerto `15672` abre su panel de administración en `http://localhost:15672` (usuario y contraseña: `chatws`). En ejecuciones posteriores, inicia el contenedor existente con `docker start chatws-rabbitmq` y vuelve a definir las variables de entorno antes de arrancar Spring Boot. Cambia las credenciales de ejemplo fuera de un entorno local.

## Conceptos y flujo

RabbitMQ es un servidor intermediario (broker): recibe mensajes y los entrega a quienes están suscritos. STOMP es el protocolo que Spring usa para hablar con RabbitMQ; WebSocket conecta el navegador con Spring. Así, varios servidores de la aplicación pueden compartir la mensajería en vez de depender cada uno de su memoria local.

El relay STOMP usa el puerto `61613`; el puerto `5672` configurado en `spring.rabbitmq.port` es para clientes AMQP. Agregar RabbitMQ no hace que este chat guarde automáticamente el historial: para conservar mensajes harían falta colas durables y mensajes persistentes, además de decidir cómo se almacenan/consultan para cada usuario.

1. El navegador se conecta al endpoint `/ws`.
2. Se suscribe a `/topic/public`.
3. Envía mensajes a `/app/chat.sendMessage`.
4. Spring procesa el mensaje y lo reenvía a `/topic/public`.
5. El relay STOMP de Spring entrega el mensaje a RabbitMQ, que lo distribuye a los suscriptores.

---

## 🏗️ Arquitectura y Flujo

### Diagrama de Arquitectura

```
┌─────────────────┐         WebSocket          ┌──────────────────┐      STOMP       ┌───────────────┐
│   Cliente Web   │ ◄────────────────────────► │   Spring Boot    │ ◄──────────────► │   RabbitMQ    │
│  (Navegador)    │     (ws://localhost:8080)  │                  │                  │               │
└─────────────────┘                            └──────────────────┘                  └───────────────┘
       │                                                 │
       │ 1. Conexión a /ws                              │
       │ 2. Suscripción a /topic/public                 │
       │ 3. Envío a /app/chat.sendMessage               │
       │                                                 │
       │ 4. Recepción de mensajes desde RabbitMQ         │
```

### Flujo Completo de un Mensaje

1. **Conexión:** El cliente web establece una conexión WebSocket con el servidor
2. **Suscripción:** El cliente se suscribe al canal `/topic/public` para recibir mensajes
3. **Envío:** El cliente envía un mensaje a `/app/chat.sendMessage`
4. **Procesamiento:** El `ChatController` recibe el mensaje
5. **Broadcast:** El mensaje se reenvía a todos los suscriptores de `/topic/public`
6. **Distribución:** RabbitMQ entrega el mensaje a todos los clientes suscritos
