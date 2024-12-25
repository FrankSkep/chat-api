import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for all routes
    app.enableCors({
        origin: 'http://localhost:5173',  // Aquí va la URL de tu frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,  // Si usas cookies o autenticación de sesión
    });

    // Enable CORS for WebSockets (Socket.io)
    app.useWebSocketAdapter(new IoAdapter(app));
    
    await app.listen(3000);  // Puerto de tu aplicación
    }
bootstrap();
