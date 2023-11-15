"use client";

import Card from "@/app/components/Card";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { createLeague } from "../actions/league";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";

type CreateLeagueProps = {
  userId: string;
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
      loadingText="Criando liga"
      isLoading={status.pending}
      disabled={status.pending}
    >
      Criar liga
    </Button>
  );
};

const OnFinished = ({ onFinished }: Pick<CreateLeagueProps, "onFinished">) => {
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

export default function CreateLeague({
  pathToRevalidate,
  userId: ownerId,
  onFinished,
}: CreateLeagueProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Criar nova liga</Card.Header.Title>

        <Card.Header.SubTitle>
          Preencha as informações abaixo para criar sua liga
        </Card.Header.SubTitle>
      </Card.Header>
      <form
        action={createLeague.bind(null, {
          ownerId,
          pathToRevalidate,
        })}
      >
        <Card.Body>
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="name">Nome da liga</FormLabel>
              <Input id="name" name="name" variant="outline" />
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
              <FormLabel htmlFor="endDate">Data do fim</FormLabel>
              <Input
                id="endDate"
                name="endDate"
                variant="outline"
                type="date"
              />
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
