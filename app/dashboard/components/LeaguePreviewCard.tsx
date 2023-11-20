"use client";

import { Flex, Divider, Text } from "@chakra-ui/react";
import { League, LeagueParticipant, LeaguePhase } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Claims } from "@auth0/nextjs-auth0";

import Card from "@/app/components/Card";

import DeleteLeague from "./DeleteLeague";

const formatDate = (date: Date | null, defaultValue: string) => {
  if (!date) {
    return defaultValue;
  }

  return new Date(date).toLocaleDateString("pt-BR");
};

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

export default function LeaguePreviewCard({
  league,
  user,
}: {
  league: League & {
    phases: Array<LeaguePhase>;
    participants: Array<LeagueParticipant>;
  };
  user: Claims | undefined;
}) {
  const router = useRouter();
  return (
    <Card key={league.id}>
      <Card.Header>
        <Card.Header.Title
          display="flex"
          gap={2}
          alignItems={"flex-start"}
          flexDir={"column"}
          mb={2}
          onClick={() => {
            router.push(`/dashboard/leagues/${league.id}`);
          }}
        >
          {league?.name}
          <Flex gap={3} display="inline-flex">
            <Text
              fontSize="x-small"
              fontWeight="thin"
              textTransform="uppercase"
            >
              <b>Data de início:</b> {formatDate(league?.startDate, "N/A")}
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
          <b>Rodadas finalizadas:</b> {numberOfPhasesAlreadyFinished(league)} de{" "}
          {league.phases.length}
        </Text>
        <Text fontWeight="thin">
          <b>Participantes em toda liga:</b> {league.participants.length}
        </Text>
      </Card.Body>
    </Card>
  );
}
