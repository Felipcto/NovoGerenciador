import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [nomeTarefa, setNomeTarefa] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3002/tarefas')
      .then(response => {
        setTarefas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar tarefas:', error);
      });
  }, []);

  const handleToggleFeito = (id, feito) => {
    const updatedTarefas = tarefas.map(tarefa => {
      if (tarefa.id === id) {
        return { ...tarefa, feito: !feito };
      }
      return tarefa;
    });

    const tarefaToUpdate = updatedTarefas.find(tarefa => tarefa.id === id);
    if (tarefaToUpdate) {
      axios.put(`http://localhost:3002/tarefas/${id}`, { nome: tarefaToUpdate.nome, feito: !feito })
        .then(() => {
          setTarefas(updatedTarefas);
        })
        .catch(error => {
          console.error('Erro ao atualizar tarefa:', error);
        });
    } else {
      // Caso a tarefa não seja encontrada, atualize apenas o estado
      setTarefas(updatedTarefas);
    }
  };

  const handleDeleteTarefa = id => {
    axios.delete(`http://localhost:3002/tarefas/${id}`)
      .then(() => {
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar tarefa:', error);
      });
  };

  const handleAddTarefa = () => {
    axios.post('http://localhost:3002/tarefas', { nome: nomeTarefa, feito: false })
      .then(response => {
        setNomeTarefa('');
        window.location.reload(); // Recarrega a página
      })
      .catch(error => {
        console.error('Erro ao criar tarefa:', error);
      });
  };

  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id} style={{ textDecoration: tarefa.feito ? 'line-through' : '' }}>
            <input
              type="checkbox"
              checked={tarefa.feito}
              onChange={() => handleToggleFeito(tarefa.id, tarefa.feito)}
            />
            {tarefa.nome}
            <button onClick={() => handleDeleteTarefa(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <form>
        <input
          type="text"
          value={nomeTarefa}
          onChange={event => setNomeTarefa(event.target.value)}
          placeholder="Nome da tarefa"
          required
        />
        <button type="button" onClick={handleAddTarefa}>Adicionar Tarefa</button>
      </form>
    </div>
  );
}

export default App;
