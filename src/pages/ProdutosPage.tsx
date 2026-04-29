import React, { useEffect, useMemo, useState } from 'react';
import { listarCategorias } from '../api/categorias';
import {
  atualizarProduto,
  criarProduto,
  listarProdutos,
  removerProduto,
} from '../api/produtos';
import { CategoriaDto, ProdutoDto } from '../api/types';

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ProdutoDto | null>(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState<number>(0);
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);

  const sortedProdutos = useMemo(
    () => [...produtos].sort((a, b) => a.nome.localeCompare(b.nome)),
    [produtos]
  );

  const sortedCategorias = useMemo(
    () => [...categorias].sort((a, b) => a.nome.localeCompare(b.nome)),
    [categorias]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        listarCategorias(),
        listarProdutos(),
      ]);
      setCategorias(cats);
      setProdutos(prods);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          'Falha ao carregar dados.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function resetForm() {
    setEditing(null);
    setNome('');
    setPreco(0);
    setCategoriaIds([]);
  }

  function toggleCategoria(id: number) {
    setCategoriaIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id) 
        : [...prev, id] 
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payload = { nome, preco: Number(preco), categoriaIds };

      if (editing) {
        await atualizarProduto(editing.id, payload);
      } else {
        await criarProduto(payload);
      }

      resetForm();
      await refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          'Falha ao salvar produto.'
      );
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Produtos</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 12,
          }}
        >
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categorias</label>

          <select
            multiple
            value={categoriaIds.map(String)}
            size={Math.min(6, sortedCategorias.length)}
          >
            {sortedCategorias.map((c) => (
              <option
                key={c.id}
                value={c.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleCategoria(c.id);
                }}
              >
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={!nome.trim()}
          >
            {editing ? 'Atualizar' : 'Criar'}
          </button>

          {editing && (
            <button
              className="btn-secondary"
              type="button"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedProdutos.map((p) => (
          <div key={p.id} className="list-item">
            <div>
              <strong>{p.nome}</strong>{' '}
              <span className="muted">#{p.id}</span>

              <div className="muted">
                Preço: R$ {Number(p.preco).toFixed(2)}
              </div>

              <div className="muted">
                Categorias:{' '}
                {(p.categorias ?? []).map((c) => c.nome).join(', ') || '-'}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setEditing(p);
                  setNome(p.nome);
                  setPreco(Number(p.preco));
                  setCategoriaIds(
                    (p.categorias ?? []).map((c) => c.id)
                  );
                }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Remover produto "${p.nome}"?`))
                    return;

                  try {
                    await removerProduto(p.id);
                    await refresh();
                  } catch (err: any) {
                    setError(
                      err?.response?.data?.message ??
                        err?.message ??
                        'Falha ao remover produto.'
                    );
                  }
                }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {!loading && sortedProdutos.length === 0 && (
          <div className="empty-state">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  );
}