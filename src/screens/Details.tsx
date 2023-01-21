import { useEffect, useState } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { PoolHeader } from "../components/PoolHeader";
import { PoolCardProps } from '../components/PoolCard';


import { api } from "../services/api";
import { Option } from "../components/Option";

interface RouteParams {
    id: string;
}

export function Details() {

    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do grupo'>('Seus Palpites');
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);


    const toast = useToast();
    const route = useRoute();
    const { id } = route.params as RouteParams;





    const fetchPoolDetails = async () => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível carregar os detalhes do Bolão',
                placement: 'bottom',
                bgColor: 'red.500',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCodeShare = async () => {
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header
                title={poolDetails.title}
                showBackButton showShareButton

                onShare={handleCodeShare}
            />

            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1} >
                        <PoolHeader
                            data={poolDetails}
                            key={poolDetails.id}

                        />
                        <HStack
                            bgColor='gray.800' p={1} rounded='sm' mb={5}
                        >
                            <Option
                                title="Seus Palpites" isSelected={optionSelected === "Seus Palpites"}
                                onPress={() => setOptionSelected("Seus Palpites")}
                            ></Option>
                            <Option
                                title="Ranking do grupo" isSelected={optionSelected === "Ranking do grupo"}
                                onPress={() => setOptionSelected("Ranking do grupo")}
                            ></Option>

                        </HStack>

                        <Guesses
                            poolId={poolDetails.id}
                        />
                    </VStack>
                    :
                    <EmptyMyPoolList code={poolDetails.code} onShare={handleCodeShare} />

            }

        </VStack>
    );
}
