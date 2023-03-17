import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories'

export default {
  Query: {
    login: async (parent: any, args: any) => {
      return adaptResolver(makeLoginController(), args)
    }
  }
}
