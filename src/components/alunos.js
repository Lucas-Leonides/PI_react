// src/components/alunos.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alunos.css'; // Importando o CSS para estilização

const Alunos = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://192.168.0.115:3000/students');
      console.log('Alunos recebidos:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const studentData = { name, birthDate, registrationNumber, class: className };
      if (selectedStudentId) {
        await axios.put(`http://192.168.0.115:3000/students/${selectedStudentId}`, studentData);
      } else {
        await axios.post('http://192.168.0.115:3000/students', studentData);
      }
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Erro ao enviar dados do aluno:', error);
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setBirthDate(student.birthDate.split('T')[0]);
    setRegistrationNumber(student.registrationNumber);
    setClassName(student.class);
    setSelectedStudentId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.0.115:3000/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setBirthDate('');
    setRegistrationNumber('');
    setClassName('');
    setSelectedStudentId(null);
  };

  const toggleButtons = (studentId) => {
    setShowButtons(showButtons === studentId ? null : studentId);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  const groupedStudents = students.reduce((acc, student) => {
    (acc[student.class] = acc[student.class] || []).push(student);
    return acc;
  }, {});

  return (
    <div className="alunos-container">
      <h2>Gerenciamento de Alunos</h2>
      <button className="refresh-button" onClick={fetchStudents}>Atualizar Alunos</button>
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          placeholder="Data de Nascimento"
          required
        />
        <input
          type="text"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="Número de Registro"
          required
        />
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Classe"
          required
        />
        <button type="submit" className="submit-button">
          {selectedStudentId ? 'Atualizar Aluno' : 'Criar Aluno'}
        </button>
      </form>

      <h2>Alunos</h2>
      {Object.entries(groupedStudents).map(([classGroup, studentsInClass]) => (
        <div key={classGroup}>
          <h3>Classe: {classGroup}</h3>
          <ul>
            {studentsInClass.map((student) => (
              <li key={student._id} className="student-item">
                {student.name} - {student.registrationNumber}
                <button onClick={() => handleEdit(student)}>Editar</button>
                <button onClick={() => handleDelete(student._id)}>Deletar</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Alunos;