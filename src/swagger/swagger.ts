import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter({
  spec: {
    info: {
      title: 'Initia VIP API',
      version: 'v1.0',
    },
  },
  swaggerHtmlEndpoint: '/swagger',
  swaggerJsonEndpoint: '/swagger.json',
})

router.swagger()

export { router }
