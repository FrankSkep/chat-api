# Real-Time Chat API

This is a chat application built with NestJS, Mongoose, and Socket.IO. The application allows users to create rooms, send messages, and receive real-time updates.

## Frontend Repository

The frontend repository for this API can be found at [https://github.com/FrankSkep/live-chat-frontend](https://github.com/FrankSkep/live-chat-frontend). This frontend is built with SvelteKit and connects to this API to provide an interactive user interface for real-time chat.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [WebSocket Events](#websocket-events)
- [License](#license)

## Features

- **Real-time Communication**: Users can send and receive messages in real-time.
- **Room Management**: Create, join, and leave chat rooms.
- **User Notifications**: Receive notifications when users connect or disconnect.
- **Message History**: Retrieve the message history of a chat room.
- **Typing Indicators**: See when other users are typing.
- **Secure Rooms**: Option to create password-protected chat rooms.
- **Message Deletion**: Ability to delete all messages from a chat room.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/FrankSkep/live-chat-api
    cd live-chat-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file and add your MongoDB connection string:
    ```env
    MONGODB_URI=mongodb://localhost:27017/nest
    ```

4. Start the application:
    ```sh
    npm run start:dev
    ```

## Usage

The application will be running on `http://localhost:3034`. You can use a WebSocket client to connect to the chat server on port `3033`.

## WebSocket Events

### Client Events

- `setUsername`: Set the username for the connected client.
    - Payload: `{ username: string }`

- `createRoom`: Create a new chat room.
    - Payload: `{ name: string, password?: string }`

- `joinRoom`: Join an existing chat room.
    - Payload: `{ room: string, username: string, password?: string }`

- `getRooms`: Get a list of all chat rooms.

- `leaveRoom`: Leave a chat room.
    - Payload: `{ room: string }`

- `message`: Send a message to a chat room.
    - Payload: `{ room: string, content: string, sender: string }`

- `typing`: Notify that the user is typing.
    - Payload: `{ room: string, username: string }`

- `deleteMessages`: Delete all messages from a chat room.
    - Payload: `{ room: string }`

### Server Events

- `notification`: Receive notifications about user connections and disconnections.
    - Payload: `{ content: string, createdAt: Date }`

- `roomCreated`: Receive confirmation when a room is created.
    - Payload: `{ name: string, password?: string, createdAt: Date }`

- `messageHistory`: Receive the message history of a room.
    - Payload: `[Message[]]`

- `rooms`: Receive a list of all chat rooms.
    - Payload: `{ name: string, protected: boolean }[]`

- `message`: Receive a new message in a chat room.
    - Payload: `{ content: string, sender: string, createdAt: Date }`

- `typing`: Receive typing notifications.
    - Payload: `string`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.