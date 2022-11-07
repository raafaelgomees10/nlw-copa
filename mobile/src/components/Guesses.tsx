import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { Box, FlatList, useToast } from "native-base";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const [games, setGames] = useState<GameProps[]>([]);
  setFirstTeamPoints;
  // const route = useRoute();
  const toast = useToast();

  // const { id } = route.params as RouteParams;

  async function fetchgames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do palpite",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite enviado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchgames();
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível enviar o palpite",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchgames();
  }, [poolId]);

  if (isLoading) {
    <Loading />;
  }
  return (
    <Box>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Game
            data={item}
            setFirstTeamPoints={setFirstTeamPoints}
            setSecondTeamPoints={setSecondTeamPoints}
            onGuessConfirm={() => handleGuessConfirm(item.id)}
          />
        )}
        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
      />
    </Box>
  );
}
