import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';
import Background from '~/components/Background';

import { Container, ProvidersList, Provider, Avatar, Name } from './styles';

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);

      const response = await api.get('providers');

      setProviders(response.data);
      setLoading(false);
    }

    loadProviders();
  }, []);

  return (
    <Background>
      <Container>
        {loading ? (
          <ActivityIndicator color="#FFF" size={40} style={{ marginTop: 60 }} />
        ) : (
          <ProvidersList
            data={providers}
            keyExtractor={p => String(providers.id)}
            renderItem={({ item: provider }) => (
              <Provider
                onPress={() =>
                  navigation.navigate('SelectDateTime', { provider })
                }
              >
                <Avatar
                  source={{
                    uri: provider.avatar
                      ? provider.avatar.url
                      : `https://api.adorable.io/avatar/50/${provider.name}.png`,
                  }}
                />
                <Name>{provider.name}</Name>
              </Provider>
            )}
          />
        )}
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({ navigation }) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
