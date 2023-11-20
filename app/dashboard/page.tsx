import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Divider, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import prisma from "@/lib/prisma";
import CreateLeague from "./components/CreateLeague";
import CreateLeagueModal from "./components/CreateLeagueModal";
import LeaguePreviewCard from "./components/LeaguePreviewCard";

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
            <LeaguePreviewCard key={league.id} league={league} user={user} />
          ))}
        </SimpleGrid>
      </Flex>
    );
  },
  {
    returnTo: "/dashboard",
  }
);
