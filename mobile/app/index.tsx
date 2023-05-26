import { useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import LogoNLW from '../src/assets/logo-nlw-spacetime.svg'
import { api } from '../src/lib/api';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/48c98d0b1240c68d7fc4',
};

export default function App() {
  const router = useRouter()

  const [, response, promptAsync] = useAuthRequest(
    {
      clientId: '48c98d0b1240c68d7fc4',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

   async function handleGitHubAuthCode(code: string){
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      
      handleGitHubAuthCode(code)
    }
  }, [response]);

  return (
    <View className='flex-1 items-center px-8 py-10'>
      <View className='flex-1 items-center justify-center gap-6'>
        <LogoNLW />
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe
            (se quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7} 
          onPress={() => promptAsync()}
          className='rounded-full bg-green-500 px-5 py-2'>
          <Text className=' font-alt text-sm uppercase text-black'>
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>

      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}