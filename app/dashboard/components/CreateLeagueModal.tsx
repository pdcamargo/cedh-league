"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import CreateLeague from "./CreateLeague";

type CreateLeagueModalProps = {
  userId: string;
  pathToRevalidate: string;
};

export default function CreateLeagueModal({
  pathToRevalidate,
  userId,
}: CreateLeagueModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  return (
    <>
      <Button colorScheme="red" variant="outline" onClick={onOpen}>
        Criar nova liga
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="transparent">
          <ModalCloseButton zIndex={1} color="white" />
          <CreateLeague
            userId={userId}
            pathToRevalidate={pathToRevalidate}
            onFinished={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
