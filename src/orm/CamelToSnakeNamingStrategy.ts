import { DefaultNamingStrategy } from 'typeorm'
import { snakeCase } from 'lodash'

export class CamelToSnakeNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName?: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName)
  }

  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ): string {
    if (customName) return customName
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_')
    )
  }

  columnNameCustomized(customName: string): string {
    return customName
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName)
  }
}
