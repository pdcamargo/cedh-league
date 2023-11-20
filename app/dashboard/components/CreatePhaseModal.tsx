"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import CreatePhase from "./CreatePhase";

type CreatePhaseModalProps = {
  userId: string;
  leagueId: string;
  pathToRevalidate: string;
};

export default function CreatePhaseModal({
  pathToRevalidate,
  userId,
  leagueId,
}: CreatePhaseModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Criar nova etapa
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="transparent">
          <ModalCloseButton zIndex={1} color="white" />
          <CreatePhase
            userId={userId}
            leagueId={leagueId}
            pathToRevalidate={pathToRevalidate}
            onFinished={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
