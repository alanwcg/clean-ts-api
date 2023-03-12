export type CompareParams = {
  value: string
  hash: string
}

export interface HashComparer {
  compare: (params: CompareParams) => Promise<boolean>
}
