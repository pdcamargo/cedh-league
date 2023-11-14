import { Container, Flex } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      direction="column"
      height="100%"
      minHeight="100vh"
      bgColor="#0F1014"
      color="#F5F5F5"
      style={{
        WebkitTapHighlightColor: "transparent",
        WebkitTextSizeAdjust: "100%",
      }}
    >
      <Sidebar />
      <Header />

      <Flex
        padding={["15px 0", null, "30px 0"]}
        flex="1 0 auto"
        flexDirection="column"
        marginLeft={["0", null, "100px"]}
      >
        <Container maxW="container.xl">{children}</Container>
      </Flex>
    </Flex>
  );
}
