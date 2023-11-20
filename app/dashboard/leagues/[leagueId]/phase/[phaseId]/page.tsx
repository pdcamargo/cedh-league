import Card from "@/app/components/Card";
import prisma from "@/lib/prisma";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Button,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { notFound } from "next/navigation";

export default withPageAuthRequired(async function PhasePage({ params }) {
  const { user } = (await getSession()) ?? {};

  const leaguePhase = await prisma.leaguePhase.findFirst({
    where: {
      id: `${params?.phaseId}`,
    },
    include: {
      rounds: true,
      league: {
        include: {
          participants: true,
          phases: {
            include: {
              checkIns: true,
            },
          },
        },
      },
    },
  });

  // 404 if not found
  if (!leaguePhase) {
    return notFound();
  }

  const isOwner = leaguePhase.league.ownerId === user?.sub;
  const isUserParticipant = leaguePhase.league.participants.some(
    (participant) => participant.userId === user?.sub
  );

  const isPhaseRunning = !!leaguePhase.startedAt && !leaguePhase.finishedAt;

  return (
    <Card>
      <Card.Body>
        <Heading>{leaguePhase.name}</Heading>
        {leaguePhase?.description && (
          <Text as="pre" whiteSpace="break-spaces">
            {leaguePhase.description}
          </Text>
        )}

        <Button mt={5} loadingText="Adicionando participação">
          {isUserParticipant ? "Você está participando" : "Participar"}
        </Button>

        <Tabs colorScheme="red" pos="relative" variant="unstyled" mt={3}>
          <TabList>
            <Tab>Rodada atual</Tab>
            <Tab>Rodadas anteriores</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="red.500"
            borderRadius="1px"
          />
          <TabPanels>
            <TabPanel px="0" pb="0">
              <p>one!</p>
            </TabPanel>
            <TabPanel px="0" pb="0">
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card.Body>
    </Card>
  );
});
