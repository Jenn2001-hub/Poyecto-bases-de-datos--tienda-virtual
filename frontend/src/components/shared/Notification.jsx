import { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';

const Notification = () => {
  useContext(NotificationContext); // Solo para proveer el contexto
  return null;
};

export default Notification;