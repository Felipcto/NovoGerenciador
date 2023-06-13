import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [editTask, setEditTask] = useState(() => JSON.parse(localStorage.getItem('editTask')) || null);

  useEffect(() => {
    axios.get('http://localhost:3002/tarefas')
      .then(response => {
        setTarefas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar tarefas:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('editTask', JSON.stringify(editTask));
  }, [editTask]);

  const handleSubmit = event => {
    event.preventDefault();

    if (editTask) {
      axios.put(`http://localhost:3002/tarefas/${editTask.id}`, { nome: nomeTarefa, feito: editTask.feito })
        .then(response => {
          setTarefas(tarefas.map(tarefa =>
            tarefa.id === editTask.id ? { ...tarefa, nome: nomeTarefa } : tarefa
          ));
          setNomeTarefa('');
          setEditTask(null);
        })
        .catch(error => {
          console.error('Erro ao atualizar tarefa:', error);
        });
    } else {
      axios.post('http://localhost:3002/tarefas', { nome: nomeTarefa, feito: false })
        .then(response => {
          setTarefas([...tarefas, { id: response.data.id, nome: nomeTarefa, feito: false }]);
          setNomeTarefa('');
        })
        .catch(error => {
          console.error('Erro ao criar tarefa:', error);
        });
    }
  };

  const handleToggleFeito = id => {
    const taskToToggle = tarefas.find(tarefa => tarefa.id === id);
    if (!taskToToggle) return;

    const updatedFeito = !taskToToggle.feito;

    axios.put(`http://localhost:3002/tarefas/${id}`, { nome: taskToToggle.nome, feito: updatedFeito })
      .then(() => {
        setTarefas(tarefas.map(tarefa =>
          tarefa.id === id ? { ...tarefa, feito: updatedFeito } : tarefa
        ));
      })
      .catch(error => {
        console.error('Erro ao atualizar tarefa:', error);
      });
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

  const handleEditTask = tarefa => {
    setNomeTarefa(tarefa.nome);
    setEditTask(tarefa);
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
              onChange={() => handleToggleFeito(tarefa.id)}
            />
            {tarefa.nome}
            <button onClick={() => handleDeleteTarefa(tarefa.id)}>Excluir</button>
            <button onClick={() => handleEditTask(tarefa)}>Editar</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nomeTarefa}
          onChange={event => setNomeTarefa(event.target.value)}
          placeholder="Nome da tarefa"
          required
        />
        <button type="submit">{editTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</button>
      </form>
    </div>
  );
}

export default App;
