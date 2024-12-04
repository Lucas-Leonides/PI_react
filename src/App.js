// src/App.js

import React from 'react';
import Avisos from './components/avisos'; // Certifique-se de que o caminho esteja correto
import Alunos from './components/alunos'; // Certifique-se de que o caminho esteja correto

const App = () => {
  return (
    <div>
      <h1>Aplicação de Avisos e Alunos</h1>
      
      <Avisos />
      <Alunos />
    </div>
  );
};

export default App; // O componente App está sendo exportado corretamente