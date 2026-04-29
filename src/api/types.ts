export type LoginResponse = {
  token: string;
  nome: string;
  usuario: string;
};

export type CategoriaDto = {
  id: number;
  nome: string;
};

export type ProdutoDto = {
  id: number;
  nome: string;
  preco: number;
  categorias?: CategoriaDto[];
};

