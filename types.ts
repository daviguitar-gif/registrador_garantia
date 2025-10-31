export enum OnusType {
  HIPOTECA = 'Hipoteca',
  ALIENACAO = 'Alienação Fiduciária',
}

export interface Onus {
  id: number;
  grau: string;
  tipo: OnusType;
  emissao: string;
  vencimento: string;
  instituicao: string;
  valor: number;
}