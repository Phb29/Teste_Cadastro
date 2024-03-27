export interface Cliente {
  id?: number;
  codigo: string;
  nome: string;
  cnpj: string;
  endereco: Endereco;
}

export interface Endereco {
  id?: number;
  localizacao: string;
  latitude?: number; // Adicionando latitude como opcional
  longitude?: number; // Adicionando longitude como opcional
}
