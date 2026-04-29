import { http } from './http';
import { ProdutoDto } from './types';

export async function listarProdutos() {
  const { data } = await http.get<ProdutoDto[]>('/api/Produtos');
  return data;
}

export async function criarProduto(payload: { nome: string; preco: number; categoriaIds: number[] }) {
  const { data } = await http.post<{ id: number }>('/api/Produtos', payload);
  return data;
}

export async function atualizarProduto(id: number, payload: { nome: string; preco: number; categoriaIds: number[] }) {
  await http.put(`/api/Produtos/${id}`, payload);
}

export async function removerProduto(id: number) {
  await http.delete(`/api/Produtos/${id}`);
}

