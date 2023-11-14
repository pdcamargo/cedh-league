import Card from "@/app/components/Card";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";

export default function LeaguePage() {
  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Liga Card Halls</Card.Header.Title>
        <Card.Header.SubTitle>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia in
          dolore dolores, soluta quasi eligendi est fuga quidem at praesentium
          nisi, vel, alias quia. Magni, quis minima. Recusandae, a excepturi?
        </Card.Header.SubTitle>
      </Card.Header>
      <Card.Body>
        <Text>
          <b>Total de etapas</b>: 6
        </Text>
        <Text>
          <b>Configuração de etapas</b>: Mensal
        </Text>
        <Text>
          <b>Total de players cadastrados</b>: 27
        </Text>
        <Text>
          <b>Previsão de fim da liga</b>: 10/01/2024
        </Text>
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
}
