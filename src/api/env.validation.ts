import { plainToClass } from 'class-transformer'
import { IsEnum, IsString, IsNumberString, validateSync } from 'class-validator'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  @IsString()
  SERVER_PORT = '8085'

  @IsString()
  LOG_NAME = 'smaple-indexer'

  @IsString()
  LOG_LEVEL = 'silent'

  @IsNumberString()
  THROTTLE_TTL = 60 // The number of seconds that each request will last in storage

  @IsNumberString()
  THROTTLE_LIMIT = 20 // The maximum number of requests within the TTL limit
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
