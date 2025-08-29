import React, { useState, useContext } from 'react';
import { StorageContext } from '../../contexts/storageContexts';
import { Cita } from '../../interfaces/interfaceProfesional/interfacesProfesional';
import { EstadoCitaActual } from '../../../constants/appConstants';

interface Props {
  cita: Cita;
}

const GuardarEstadoCita = ({ cita }: Props) => {
  // Obtenemos la instancia de Storage desde el contexto
  const { storage } = useContext(StorageContext);
  const [estadoCita, setEstadoCita] = useState<EstadoCitaActual>(cita.estado);

  // Función para guardar el estado en Storage usando la instancia centralizada
  const guardarEnStorage = async (idCita: number, estado: EstadoCitaActual) => {
    if (!storage) return;
    // Obtener los estados guardados o inicializarlos en un objeto vacío
    const estadosGuardados = (await storage.get('estadosCitas')) || {};
    estadosGuardados[idCita] = estado;
    await storage.set('estadosCitas', estadosGuardados);
  };

  // Actualiza el estado local y guarda el cambio en Storage
  const handleEstadoChange = async (nuevoEstado: EstadoCitaActual) => {
    setEstadoCita(nuevoEstado);
    await guardarEnStorage(cita.id, nuevoEstado);
  };

  return (
    <div>
      <p>Estado actual: {estadoCita}</p>
      <select
        value={estadoCita}
        onChange={(e) => handleEstadoChange(e.target.value as EstadoCitaActual)}
      >
        {Object.values(EstadoCitaActual).map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GuardarEstadoCita;
