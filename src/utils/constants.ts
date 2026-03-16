// src/utils/constants.ts
export const UF_MAP: Record<string, string> = {
  "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas", "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo", "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul", "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná", "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte", "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina", "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

export const NATURALIDADE_MAP: Record<string, string> = {
  "alagoas": "de Alagoas", "goias": "de Goiás", "goiás": "de Goiás", "mato grosso": "de Mato Grosso", "mato grosso do sul": "de Mato Grosso do Sul", "minas gerais": "de Minas Gerais", "pernambuco": "de Pernambuco", "rondonia": "de Rondônia", "rondônia": "de Rondônia", "roraima": "de Roraima", "santa catarina": "de Santa Catarina", "sao paulo": "de São Paulo", "são paulo": "de São Paulo", "sergipe": "de Sergipe", "bahia": "da Bahia", "paraiba": "da Paraíba", "paraíba": "da Paraíba", "acre": "do Acre", "amapa": "do Amapá", "amapá": "do Amapá", "amazonas": "do Amazonas", "ceara": "do Ceará", "ceará": "do Ceará", "espirito santo": "do Espírito Santo", "espírito santo": "do Espírito Santo", "maranhao": "do Maranhão", "maranhão": "do Maranhão", "para": "do Pará", "pará": "do Pará", "parana": "do Paraná", "paraná": "do Paraná", "piaui": "do Piauí", "piauí": "do Piauí", "rio de janeiro": "do Rio de Janeiro", "rio grande do norte": "do Rio Grande do Norte", "rio grande do sul": "do Rio Grande do Sul", "tocantins": "do Tocantins"
};

export type Aluno = {
  nome: string;
  cpf: string;
  naturalidade: string;
  telefone: string;
};