import { GraphQLError } from 'graphql'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { Controller } from '@/presentation/protocols'

export const adaptResolver = async (
  controller: Controller,
  args: any
): Promise<any> => {
  const httpResponse = await controller.handle(args)
  switch (httpResponse.statusCode) {
    case 200:
    case 204:
      return httpResponse.body
    case 400:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT }
      })
    case 401:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: { code: 'AUTHENTICATION' }
      })
    case 403:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: { code: 'FORBIDDEN' }
      })
    default:
      throw new GraphQLError(httpResponse.body.message, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR }
      })
  }
}
