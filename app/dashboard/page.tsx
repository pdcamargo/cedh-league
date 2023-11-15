import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Card from "../components/Card";
import { Divider, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import prisma from "@/lib/prisma";
import CreateLeague from "./components/CreateLeague";
import { League, LeaguePhase } from "@prisma/client";
import CreateLeagueModal from "./components/CreateLeagueModal";

import DeleteLeague from "./components/DeleteLeague";

const fetcher = async (
  uri: string
): Promise<{
  leagues: Array<any>;
}> => {
  const response = await fetch(uri);
  return response.json();
};

const formatDate = (date: Date | null, defaultValue: string) => {
  if (!date) {
    return defaultValue;
  }

  return new Date(date).toLocaleDateString("pt-BR");
};

export default withPageAuthRequired(
  async function DashboardPage() {
    const { user } = (await getSession()) ?? {};

    const leagues = await prisma.league.findMany({
      where: {
        ownerId: user?.sub,
      },
      // select participatns relation
      include: {
        participants: true,
        phases: true,
      },
    });

    const leaguesUserIsIn = await prisma.league.findMany({
      where: {
        participants: {
          some: {
            userId: user?.sub,
          },
        },
      },
    });

    const hasLeagueStarted = (
      league: League & {
        phases: Array<LeaguePhase>;
      }
    ) => {
      return league.phases.some((phase) => !!phase.startedAt);
    };

    const numberOfPhasesAlreadyFinished = (
      league: League & {
        phases: Array<LeaguePhase>;
      }
    ) => {
      return league.phases.filter((phase) => !!phase.finishedAt).length;
    };

    const frequencyToText = (frequency: League["phasesFrequency"]) => {
      const objMap: Record<League["phasesFrequency"], string> = {
        weekly: "Semanal",
        fortnightly: "Quinzenal",
        monthly: "Mensal",
        quarterly: "Trimestral",
        yearly: "Anual",
      };

      return objMap[frequency];
    };

    return (
      <Flex flexDirection="column" gap={3}>
        <Flex
          flex="1"
          maxWidth={leagues.length === 0 ? "450px" : undefined}
          justifyContent="space-between"
          alignItems="center"
        >
          {leagues.length === 0 ? (
            <CreateLeague userId={user?.sub} pathToRevalidate="/dashboard" />
          ) : (
            <>
              <Heading size="md">Ligas criadas por mim</Heading>

              <CreateLeagueModal
                userId={user?.sub}
                pathToRevalidate="/dashboard"
              />
            </>
          )}
        </Flex>

        <Divider borderColor="#1E2027" />

        <SimpleGrid minChildWidth="320px" spacing={3}>
          {leagues.map((league) => (
            <Card key={league.id}>
              <Card.Header>
                <Card.Header.Title
                  display="flex"
                  gap={2}
                  alignItems={"flex-start"}
                  flexDir={"column"}
                  mb={2}
                >
                  {league?.name}
                  <Flex gap={3} display="inline-flex">
                    <Text
                      fontSize="x-small"
                      fontWeight="thin"
                      textTransform="uppercase"
                    >
                      <b>Data de início:</b>{" "}
                      {formatDate(league?.startDate, "N/A")}
                    </Text>
                    <Text
                      fontSize="x-small"
                      fontWeight="thin"
                      textTransform="uppercase"
                    >
                      <b>Data de fim:</b> {formatDate(league?.endDate, "N/A")}
                    </Text>
                  </Flex>
                </Card.Header.Title>

                <DeleteLeague
                  leagueId={league.id}
                  userId={user?.sub}
                  pathToRevalidate="/dashboard"
                />
              </Card.Header>
              <Card.Body>
                <Text fontWeight="thin">
                  <b>Frequência:</b> {frequencyToText(league.phasesFrequency)}
                </Text>

                <Divider borderColor="#1E2027" my={2} />

                <Text fontWeight="thin">
                  <b>Min participantes:</b> {league.minParticipants ?? "N/A"}
                </Text>

                <Text fontWeight="thin">
                  <b>Max participantes:</b> {league.maxParticipants ?? "N/A"}
                </Text>

                <Divider borderColor="#1E2027" my={2} />

                <Text fontWeight="thin">
                  <b>Rodadas finalizadas:</b>{" "}
                  {numberOfPhasesAlreadyFinished(league)} de{" "}
                  {league.phases.length}
                </Text>
                <Text fontWeight="thin">
                  <b>Participantes em toda liga:</b>{" "}
                  {league.participants.length}
                </Text>
              </Card.Body>
            </Card>
          ))}
        </SimpleGrid>
      </Flex>
    );
  },
  {
    returnTo: "/dashboard",
  }
);
