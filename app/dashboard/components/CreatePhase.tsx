"use client";

import Card from "@/app/components/Card";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { createLeaguePhase } from "../actions/league";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";

type CreatePhaseProps = {
  userId: string;
  leagueId: string;
  pathToRevalidate: string;
  onFinished?: () => void;
};

const SubmitButton = () => {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      colorScheme="red"
      width="full"
      loadingText="Criando etapa"
      isLoading={status.pending}
      disabled={status.pending}
    >
      Criar etapa
    </Button>
  );
};

const OnFinished = ({ onFinished }: Pick<CreatePhaseProps, "onFinished">) => {
  const status = useFormStatus();
  const wasPending = useRef(status.pending);

  useEffect(() => {
    // Check if the status was previously pending and is now not pending
    if (wasPending.current && !status.pending) {
      onFinished?.();
    }

    // Update the ref to the current status for the next render
    wasPending.current = status.pending;
  }, [status.pending, onFinished]);

  return null;
};

export default function CreatePhase({
  pathToRevalidate,
  userId: ownerId,
  leagueId,
  onFinished,
}: CreatePhaseProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Criar nova etapa</Card.Header.Title>

        <Card.Header.SubTitle>
          Preencha as informações abaixo para criar uma nova etapa.
        </Card.Header.SubTitle>
      </Card.Header>
      <form
        action={createLeaguePhase.bind(null, {
          ownerId,
          pathToRevalidate,
          leagueId,
        })}
      >
        <Card.Body>
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="name">Nome para etapa</FormLabel>
              <Input
                id="name"
                name="name"
                variant="outline"
                placeholder="Etapa 3"
                required
                isRequired
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="description">Descrição</FormLabel>
              <Textarea
                id="description"
                name="description"
                variant="outline"
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="startDate">Data de início</FormLabel>
              <Input
                id="startDate"
                name="startDate"
                variant="outline"
                type="date"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="isProxyValid">
                Proxy é válido para essa etapa?
              </FormLabel>

              <Flex direction="row" alignItems="center" gap={2}>
                <Switch
                  defaultChecked
                  id="isProxyValid"
                  name="isProxyValid"
                  onChange={(e) => {
                    const hint = document.getElementById("isProxyValidHint");

                    if (hint) {
                      hint.innerText = e.target.checked ? "Sim" : "Não";
                    }
                  }}
                />
                <Text id="isProxyValidHint">Sim</Text>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="requestCommanderForCheckIn">
                Exigir comandante para participar dessa etapa?
              </FormLabel>

              <Flex direction="row" alignItems="center" gap={2}>
                <Switch
                  defaultChecked={false}
                  id="requestCommanderForCheckIn"
                  name="requestCommanderForCheckIn"
                  onChange={(e) => {
                    const hint = document.getElementById(
                      "requestCommanderForCheckInHint"
                    );

                    if (hint) {
                      hint.innerText = e.target.checked ? "Sim" : "Não";
                    }
                  }}
                />
                <Text id="requestCommanderForCheckInHint">Não</Text>
              </Flex>
            </FormControl>
          </VStack>
        </Card.Body>

        <Card.Footer>
          <SubmitButton />
        </Card.Footer>

        <OnFinished onFinished={onFinished} />
      </form>
    </Card>
  );
}
