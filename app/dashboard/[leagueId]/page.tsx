import Card from "@/app/components/Card";
import prisma from "@/lib/prisma";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { notFound } from "next/navigation";

import { Button, ButtonGroup, Text } from "@chakra-ui/react";

export default withPageAuthRequired(async function LeaguePage() {
  const { user } = (await getSession()) ?? {};

  const league = await prisma.league.findFirst({
    where: {
      OR: [
        {
          ownerId: user?.sub,
        },
        {
          participants: {
            some: {
              userId: user?.sub,
            },
          },
        },
      ],
    },
  });

  // 404 if not found
  if (!league) {
    return notFound();
  }

  const isOwner = league.ownerId === user?.sub;

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>{league?.name}</Card.Header.Title>
        {!!league?.description && (
          <Card.Header.SubTitle>{league.description}</Card.Header.SubTitle>
        )}
      </Card.Header>
      <Card.Body>
        <Text as="pre">{JSON.stringify(league, null, 2)}</Text>
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
