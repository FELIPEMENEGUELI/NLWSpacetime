import { View, Text, TextInput, ScrollView } from 'react-native'
import LogoNLW from '../src/assets/logo-nlw-spacetime.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Switch } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

export default function NewMemory(){
  const {bottom, top} = useSafeAreaInsets()
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function openImagePicker(){
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if(result.assets[0]) {
        setPreview(result.assets[0].uri)
      }

    } catch (error) {
        console.log(error.message)
    }
  };

  async function handleCreateMemory(){
    const token = await SecureStore.getItemAsync('token')
    
    let coverUrl = ''

    if (preview) { 
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image.jpeg'
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post('/memories', {
      content,
      isPublic,
      coverUrl, 
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    router.push('/')
  }

  return (
    <ScrollView className='flex=1 px-8' contentContainerStyle={{paddingBottom: bottom, paddingTop: top}}>
      <View className='flex-row mt-4 justify-between items-center'>
        <LogoNLW />
        <Link href='/memories' asChild>
          <TouchableOpacity
            className='h-10 w-10 items-center
            justify-center rounded-full bg-purple-500'>
            <Icon name="arrow-left" size={16} color= "#FFF" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className='mt-6 space-y-6'>
        <View className='flex-row items-center gap-2'>
          <Switch value={isPublic} onValueChange={setIsPublic}
          thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
          trackColor={{ false: '#767577', true: '#372560' }}/>
          <Text className='font-body text-base text-gray-500'>
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className='h-32 bg-black-20 justify-center rounded-lg border border-dashed border-gray-500'>
          {preview ? (
            <Image source={{uri: preview}} 
              className="h-full w-full rounded-lg object-cover"/>
          ) : (
            <View className="flex-row justify-center items-center gap-2">
            <Icon name="image" color="#fff" />
            <Text className='font-body text-sm text-gray-200'>
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
          )}
        </TouchableOpacity>

        <TextInput
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical='top'
          className="p-0 font-body text-lg text-gray-50"
          placeholder='Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre.'/>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCreateMemory}
            className='items-center self-end rounded-full bg-green-500 px-5 py-2'>
            <Text className=' font-alt text-sm uppercase text-black'>
              Salvar
            </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  )
}
