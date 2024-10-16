import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import compression from 'compression'
import hpp from 'hpp'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { config } from 'config'

export async function initServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })

  app.enableCors()
  const port = config.serverPort
  app.useLogger(app.get(Logger))

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sample Indexer')
    .setDescription('Sample Indexer')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    })
  )

  app.use([compression(), hpp()])
  await app.listen(port)
}
