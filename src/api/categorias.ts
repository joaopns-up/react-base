import { http } from './http';
import { CategoriaDto } from './types';

export async function listarCategorias() {
  const { data } = await http.get<CategoriaDto[]>('/api/Categorias');
  return data;
}

export async function criarCategoria(nome: string) {
  const { data } = await http.post<CategoriaDto>('/api/Categorias', { nome });
  return data;
}

export async function atualizarCategoria(id: number, nome: string) {
  await http.put(`/api/Categorias/${id}`, { nome });
}

export async function removerCategoria(id: number) {
  await http.delete(`/api/Categorias/${id}`);
}

