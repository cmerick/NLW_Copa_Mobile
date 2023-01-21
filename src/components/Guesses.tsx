import { useState, useEffect } from 'react';
import { useToast, FlatList } from 'native-base';

import { api } from "../services/api";

import { Game, GameProps } from "../components/Game"
import { Loading } from './Loading';


interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {

  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);

  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  const fetchGames = async () => {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

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

  const handleGuessConfirm = async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'bottom',
          bgColor: 'red.500',
        });


      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: 'Palpite realizado com sucesso',
        placement: 'bottom',
        bgColor: 'green.500',
      });

      fetchGames();

    } catch (error) {
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    };
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}

        />
      )
      }
    />
  );
}
