import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";

export function Sidebar() {
  return (
    <Flex
      borderRight="1px solid #15171c"
      position="fixed"
      top="0"
      left="0"
      bottom="0"
      width="100px"
      flexDir="column"
      bgColor="#0D0E12"
      display={["none", null, "flex"]}
    >
      <Box mx="auto" py={8}>
        <Image width={50} height={50} src="/logo.svg" alt="cEDH League Logo" />
      </Box>
    </Flex>
  );
}
