import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories'

export default {
  Query: {
    login: async (parent: any, args: any) => {
      return adaptResolver(makeLoginController(), args)
    }
  },

  Mutation: {
    signup: async (parent: any, args: any) => {
      return adaptResolver(makeSignUpController(), args)
    }
  }
}
