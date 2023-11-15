"use client";

import { IconButton, IconButtonProps, Spinner } from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { deleteLeague } from "../actions/league";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";

type DeleteLeagueProps = Partial<IconButtonProps> & {
  leagueId: string;
  userId: string;
  pathToRevalidate: string;
  onFinished?: () => void;
};

const OnFinished = ({ onFinished }: Pick<DeleteLeagueProps, "onFinished">) => {
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

const Button = (props: Partial<IconButtonProps>) => {
  const status = useFormStatus();

  return (
    <IconButton
      isRound
      type="submit"
      colorScheme="red"
      variant="outline"
      icon={<FaTrashAlt />}
      size="xs"
      pos="absolute"
      right={2}
      top={2}
      {...props}
      aria-label="Delete league"
      isLoading={status.pending}
    />
  );
};

export default function DeleteLeague({
  leagueId,
  userId,
  pathToRevalidate,
  ...props
}: DeleteLeagueProps) {
  return (
    <form
      action={deleteLeague.bind(null, {
        id: leagueId,
        ownerId: userId,
        pathToRevalidate,
      })}
    >
      <Button {...props} />
      <OnFinished onFinished={props.onFinished} />
    </form>
  );
}
