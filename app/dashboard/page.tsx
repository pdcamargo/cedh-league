"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Card from "../components/Card";
import useSWR from "swr";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";

const fetcher = async (
  uri: string
): Promise<{
  leagues: Array<any>;
}> => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function DashboardPage() {
    const { data, error } = useSWR("/api/league", fetcher);

    if (error) return <div>oops... {error.message}</div>;
    if (data === undefined) return <div>Loading...</div>;

    if (data.leagues.length === 0) {
      return (
        <Card>
          <Card.Header>
            <Card.Header.Title>No leagues found</Card.Header.Title>
          </Card.Header>
          <Card.Body>
            You can create a new league by clicking the button below
          </Card.Body>
          <Card.Footer>
            <ButtonGroup spacing="2">
              <Button variant="solid" colorScheme="green">
                Create League
              </Button>
            </ButtonGroup>
          </Card.Footer>
        </Card>
      );
    }

    return (
      <Flex flexWrap="wrap" gap={3}>
        {data.leagues.map((league: any) => (
          <Card key={league.id}>
            <Card.Header>
              <Card.Header.Title>{league?.name}</Card.Header.Title>
              {league?.description && (
                <Card.Header.SubTitle>
                  {league.description}
                </Card.Header.SubTitle>
              )}
            </Card.Header>
            <Card.Body>League {JSON.stringify(league)}</Card.Body>
          </Card>
        ))}
      </Flex>
    );
  },
  {
    returnTo: "/dashboard",
  }
);
