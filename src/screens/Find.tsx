import { Heading, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";

import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    const toast = useToast();

    const navigation = useNavigation();

    const handleJoinPool = async () => {
        try {
            setIsLoading(true);


            if (!code.trim()) {
                return toast.show({
                    title: 'Informe o código',
                    placement: 'bottom',
                    bgColor: 'red.500'
                })
            }

            await api.post('/pools/join', { code });
            navigation.navigate('pools');

            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'bottom',
                bgColor: 'green.500'
            })



        } catch (error) {
            console.log(error);
            setIsLoading(false);

            if (error.response?.data?.message === 'Bolão não encontrado.') {

                return toast.show({
                    title: 'Bolão não encontrado, verifique se o código está correto',
                    placement: 'bottom',
                    bgColor: 'red.500'
                });

            }

            if (error.response?.data?.message === 'Você ja se junto a esse bolão.') {

                return toast.show({
                    title: 'Você já se juntou a esse bolão.',
                    placement: 'bottom',
                    bgColor: 'red.500'
                });

            }

            toast.show({
                title: 'Bolão não encontrado.',
                placement: 'bottom',
                bgColor: 'red.500'
            });

        }

    }

    return (
        <VStack flex={1} bgColor={'gray.900'}>
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems='center'>


                <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
                    Encontre um bolão através de {'\n'} seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />


            </VStack>

        </VStack>
    )
}