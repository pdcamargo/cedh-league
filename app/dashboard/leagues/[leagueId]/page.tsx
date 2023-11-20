import Card from "@/app/components/Card";
import prisma from "@/lib/prisma";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { notFound } from "next/navigation";

import {
  Button,
  ButtonGroup,
  Divider,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import CreatePhaseModal from "../../components/CreatePhaseModal";
import { LeaguePhase, LeaguePhaseCheckIn } from "@prisma/client";
import AllowPhaseCheckIn from "./components/AllowPhaseCheckIn";
import Link from "next/link";

export default withPageAuthRequired(async function LeaguePage({ params }) {
  const { user } = (await getSession()) ?? {};

  const league = await prisma.league.findFirst({
    where: {
      id: `${params?.leagueId}`,
    },
    include: {
      participants: true,
      phases: {
        include: {
          checkIns: true,
        },
      },
    },
  });

  // 404 if not found
  if (!league) {
    return notFound();
  }

  const isOwner = league.ownerId === user?.sub;

  const hasRunningPhase = league.phases.some((phase) => !!phase.startedAt);
  const hasFinishedPhase = league.phases.some((phase) => !!phase.finishedAt);
  const hasPlannedPhase = league.phases.some(
    (phase) => !phase.startedAt && !phase.finishedAt
  );
  const plannedPhases = league.phases.filter(
    (phase) => !phase.startedAt && !phase.finishedAt
  );
  const runningPhases = league.phases.filter((phase) => !!phase.startedAt);
  const finishedPhases = league.phases.filter((phase) => !!phase.finishedAt);

  const totalParticipantsInLeague = league.participants.length;

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>{league?.name}</Card.Header.Title>
        {!!league?.description && (
          <Card.Header.SubTitle as="pre" whiteSpace="break-spaces">
            {league.description}
          </Card.Header.SubTitle>
        )}
      </Card.Header>
      <Card.Body>
        <ButtonGroup spacing="2">
          <CreatePhaseModal
            leagueId={league.id}
            userId={user?.sub}
            pathToRevalidate={`/dashboard/leagues/${league.id}`}
          />
        </ButtonGroup>

        <Divider borderColor="#1E2027" my={3} />

        <Heading size="md">Etapas acontecendo</Heading>
        {!hasRunningPhase && <Text>Nenhuma etapa acontecendo no momento</Text>}
        {hasRunningPhase && (
          <SimpleGrid minChildWidth="180px">
            {runningPhases.map((phase) => (
              <Card key={phase.id} maxWidth="300px">
                <Card.Header>
                  {phase.name}

                  <Divider borderColor="#1E2027" />
                </Card.Header>
                <Card.Body>
                  <Text>
                    <strong>Participantes:</strong> {phase.checkIns.length}/
                    {totalParticipantsInLeague}
                  </Text>

                  <Link
                    href={`/dashboard/leagues/${league.id}/phase/${phase.id}`}
                  >
                    <Button colorScheme="red">Ver etapa</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </SimpleGrid>
        )}

        <Divider borderColor="#1E2027" my={3} />

        <Heading size="md" mb={2}>
          Etapas planejadas
        </Heading>
        {!hasPlannedPhase && <Text>Nenhuma etapa planejada</Text>}
        {hasPlannedPhase && (
          <SimpleGrid minChildWidth="180px">
            {plannedPhases.map((phase) => (
              <Card key={phase.id} maxWidth="300px" boxShadow="md">
                <Card.Header>
                  {phase.name}

                  <Divider borderColor="#1E2027" />
                </Card.Header>
                <Card.Body gap={5} display="flex" flexDir="column">
                  <Text>
                    <strong>Participantes:</strong> {phase.checkIns.length}/
                    {totalParticipantsInLeague}
                  </Text>

                  <AllowPhaseCheckIn
                    pathToRevalidate={`/dashboard/leagues/${league.id}`}
                    userId={user?.sub}
                    phaseId={phase.id}
                  />
                </Card.Body>
              </Card>
            ))}
          </SimpleGrid>
        )}

        <Divider borderColor="#1E2027" my={3} />

        <Heading size="md">Etapas finalizadas</Heading>
        {!hasFinishedPhase && <Text>Nenhuma etapa foi finalizada</Text>}
      </Card.Body>

      <Card.Footer>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="red">
            End League
          </Button>
          <Button variant="ghost" colorScheme="yellow">
            Delete league
          </Button>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
});
