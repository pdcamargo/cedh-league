"use client";

import Card from "@/app/components/Card";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { createLeague } from "../actions/league";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";

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
  const [controlNumberOfParticipants, setControlNumberOfParticipants] =
    useState(false);

  const [minParticipantsSliderValue, setMinParticipantsSliderValue] =
    useState(0);
  const [maxParticipantsSliderValue, setMaxParticipantsSliderValue] =
    useState(0);

  const minParticipantsDisclosure = useDisclosure();
  const maxParticipantsDisclosure = useDisclosure();

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

            <FormControl>
              <FormLabel htmlFor="phasesFrequency">
                Frequência de partidas
              </FormLabel>
              <Select
                id="phasesFrequency"
                name="phasesFrequency"
                defaultValue="monthly"
                color="black"
                variant="filled"
                _focus={{
                  bgColor: "white",
                }}
              >
                <option value="weekly">Semanal</option>
                <option value="fortnightly">Quinzenal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </Select>
            </FormControl>

            <Divider borderColor="GrayText" my={2} />

            <FormControl display="flex" alignItems="center" flexDir="row">
              <FormLabel htmlFor="controlNumberOfParticipants" mb={0}>
                Controlar número de jogadores
              </FormLabel>

              <Checkbox
                id="controlNumberOfParticipants"
                checked={controlNumberOfParticipants}
                onChange={(e) =>
                  setControlNumberOfParticipants(e.target.checked)
                }
              />
            </FormControl>

            {controlNumberOfParticipants && (
              <>
                <FormControl>
                  <FormLabel htmlFor="minParticipants">
                    Número mínimo de participantes
                  </FormLabel>

                  <Slider
                    id="minParticipants"
                    name="minParticipants"
                    defaultValue={0}
                    min={0}
                    max={100}
                    colorScheme="red"
                    onChange={(val) => setMinParticipantsSliderValue(val)}
                    onMouseEnter={minParticipantsDisclosure.onOpen}
                    onMouseLeave={minParticipantsDisclosure.onClose}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="teal.500"
                      color="white"
                      placement="top"
                      isOpen={minParticipantsDisclosure.isOpen}
                      label={`${minParticipantsSliderValue} jogadores`}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="maxParticipants">
                    Número máximo de participantes
                  </FormLabel>

                  <Slider
                    id="maxParticipants"
                    name="maxParticipants"
                    defaultValue={0}
                    min={0}
                    max={100}
                    colorScheme="red"
                    onChange={(val) => setMaxParticipantsSliderValue(val)}
                    onMouseEnter={maxParticipantsDisclosure.onOpen}
                    onMouseLeave={maxParticipantsDisclosure.onClose}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="teal.500"
                      color="white"
                      placement="top"
                      isOpen={maxParticipantsDisclosure.isOpen}
                      label={`${maxParticipantsSliderValue} jogadores`}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </FormControl>
              </>
            )}
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
