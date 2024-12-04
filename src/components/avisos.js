// src/components/avisos.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Avisos.css'; // Importando o CSS para estilização

const Avisos = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [noticeData, setNoticeData] = useState('');
  const [loading, setLoading] = useState(true);

  // Função para buscar avisos
  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://192.168.0.115:3000/general-notices');
      setNotices(response.data); // Assume que a resposta é um array de avisos
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar ou atualizar avisos
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne recarregar a página ao submeter o formulário
    try {
      const dataToSubmit = { notice: noticeData }; // Ajuste para usar "notice"
      if (selectedNoticeId) {
        await axios.put(`http://192.168.0.115:3000/general-notices/${selectedNoticeId}`, dataToSubmit);
      } else {
        await axios.post('http://192.168.0.115:3000/general-notices', dataToSubmit);
      }
      resetForm();        // Limpa o formulário
      fetchNotices();     // Atualiza a lista de avisos
    } catch (error) {
      console.error('Erro ao enviar aviso:', error);
    }
  };

  // Função de edição de aviso
  const handleEdit = (notice) => {
    setNoticeData(notice.notice); // Preenche o campo com a mensagem do aviso selecionado
    setSelectedNoticeId(notice._id); // Armazena o ID do aviso selecionado (com "_id")
  };

  // Função para deletar um aviso
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.0.115:3000/general-notices/${id}`);
      fetchNotices(); // Atualiza a lista de avisos após a exclusão
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
    }
  };

  const resetForm = () => {
    setNoticeData('');  // Limpa o campo de input
    setSelectedNoticeId(null); // Reseta o ID selecionado
  };

  // Realiza a chamada à API para buscar avisos ao carregar o componente
  useEffect(() => {
    fetchNotices();
  }, []);

  // Exibe mensagem de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Renderização do componente
  return (
    <div className="avisos-container">
      <h1>Avisos</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={noticeData} 
          onChange={(e) => setNoticeData(e.target.value)} 
          placeholder="Digite um aviso" 
          required
          className="input-field"
        />
        <div className="button-group">
          <button type="submit" className="button">
            {selectedNoticeId ? 'Atualizar Aviso' : 'Criar Aviso'}
          </button>
        </div>
      </form>
      <ul>
        {notices.map((notice) => (
          <li key={notice._id} className="notice-item"> {/* Usar "_id" para chave */}
            {notice.notice} {/* Usar "notice" para exibir a mensagem */}
            <div className="action-buttons">
              <button onClick={() => handleEdit(notice)} className="edit-button">Editar</button>
              <button onClick={() => handleDelete(notice._id)} className="delete-button">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Avisos;