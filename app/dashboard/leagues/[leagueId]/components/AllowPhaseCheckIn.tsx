"use client";

import { Button } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { allowPhaseCheckIn } from "@/app/dashboard/actions/league";

type AllowPhaseCheckInProps = {
  userId: string;
  phaseId: string;
  pathToRevalidate: string;
  onFinished?: () => void;
};

const SubmitButton = () => {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      colorScheme="red"
      variant="outline"
      width="full"
      loadingText="Liberando inscrições"
      isLoading={status.pending}
      disabled={status.pending}
    >
      Liberar inscrições
    </Button>
  );
};

const OnFinished = ({
  onFinished,
}: Pick<AllowPhaseCheckInProps, "onFinished">) => {
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

export default function AllowPhaseCheckIn({
  pathToRevalidate,
  userId: ownerId,
  phaseId,
  onFinished,
}: AllowPhaseCheckInProps) {
  return (
    <form
      action={allowPhaseCheckIn.bind(null, {
        ownerId,
        pathToRevalidate,
        phaseId,
      })}
    >
      <SubmitButton />

      <OnFinished onFinished={onFinished} />
    </form>
  );
}
