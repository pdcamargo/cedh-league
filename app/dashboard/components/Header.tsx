import { getSession } from "@auth0/nextjs-auth0";
import { Avatar, Button, Container, Flex, Heading } from "@chakra-ui/react";

export async function Header() {
  const { user } = (await getSession()) ?? {};

  return (
    <Flex
      borderBottom="1px solid #15171c"
      bgColor="#15171C"
      position="sticky"
      marginLeft={["0", null, "100px"]}
      top="0"
      right="0"
      height={["60px", null, "80px"]}
      justifyContent="space-between"
      alignItems="stretch"
      px={[4, null, 8]}
    >
      <Flex alignItems="center" gap={[5, null, "80px"]}>
        <Heading size="md">cEDH League</Heading>

        <Flex alignItems="center" gap={3}>
          <Button
            variant="ghost"
            bgColor="#15171c"
            color="#808290"
            _hover={{
              color: "red.600",
            }}
          >
            Leagues
          </Button>
        </Flex>
      </Flex>
      <Flex alignItems="center" gap={3}>
        <Avatar size={["sm", "md"]} src={user?.picture} name={user?.name} />
      </Flex>
    </Flex>
  );
}
