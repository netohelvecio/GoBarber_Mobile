import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '~/services/api';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';

import { Container, Title, List } from './styles';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      const response = await api.get('appointments');

      setAppointments(response.data);
      setLoading(false);
    }

    loadAppointments();
  }, []);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);

    setAppointments(
      appointments.map(a =>
        a.id === id ? { ...a, canceled_at: response.data.canceled_at } : a
      )
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        {loading ? (
          <ActivityIndicator color="#FFF" size={40} style={{ marginTop: 60 }} />
        ) : (
          <List
            data={appointments}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Appointment onCancel={() => handleCancel(item.id)} data={item} />
            )}
          />
        )}
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="event" size={20} color={tintColor} />
  ),
};
