"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Card from "../components/Card";
import useSWR from "swr";
import { Flex } from "@chakra-ui/react";

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
