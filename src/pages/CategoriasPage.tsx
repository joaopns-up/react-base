import React, { useEffect, useMemo, useState } from 'react';
import {
  atualizarCategoria,
  criarCategoria,
  listarCategorias,
  removerCategoria,
} from '../api/categorias';
import { CategoriaDto } from '../api/types';

export function CategoriasPage() {
  const [items, setItems] = useState<CategoriaDto[]>([]);
  const [nome, setNome] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CategoriaDto | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.nome.localeCompare(b.nome)),
    [items]
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await listarCategorias();
      setItems(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          'Falha ao carregar categorias.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      if (editing) {
        await atualizarCategoria(editing.id, nome);
        setEditing(null);
      } else {
        await criarCategoria(nome);
      }

      setNome('');
      await refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          'Falha ao salvar categoria.'
      );
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Categorias</h2>

      {/* INÍCIO FORM */}
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
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
              onClick={() => {
                setEditing(null);
                setNome('');
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {/* FIM FORM */}
      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      {/* INÍCIO LISTA */}
      <div className="list">
        {sortedItems.map((c) => (
          <div key={c.id} className="list-item">
            <div>
              <strong>{c.nome}</strong>{' '}
              <span className="muted">#{c.id}</span>
            </div>

            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setEditing(c);
                  setNome(c.nome);
                }}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                type="button"
                onClick={async () => {
                  if (
                    !window.confirm(`Remover categoria "${c.nome}"?`)
                  )
                    return;

                  try {
                    await removerCategoria(c.id);
                    await refresh();
                  } catch (err: any) {
                    setError(
                      err?.response?.data?.message ??
                        err?.message ??
                        'Falha ao remover categoria.'
                    );
                  }
                }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {!loading && sortedItems.length === 0 && (
          <div className="empty-state">
            Nenhuma categoria encontrada.
          </div>
        )}
      </div>
      {/* FIM LISTA */}
    </div>
  );
}