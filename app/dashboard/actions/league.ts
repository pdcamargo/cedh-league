"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createLeagueSchema = z.object({
  ownerId: z.string(),
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(5000).optional().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  phasesFrequency: z.enum([
    "weekly",
    "fortnightly",
    "monthly",
    "quarterly",
    "yearly",
  ]),
});

const createLeaguePhaseSchema = z.object({
  leagueId: z.string(),
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(5000).optional().nullable(),
  isProxyValid: z.boolean().optional().default(true),
  requestCommanderForCheckIn: z.boolean().optional().default(false),
  startDate: z.string().nullable().optional(),
});

const deleteLeagueSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
});

const allowPhaseCheckInSchema = z.object({
  phaseId: z.string(),
  ownerId: z.string(),
});

export async function allowPhaseCheckIn(
  otherData: {
    phaseId: string;
    ownerId: string;
    pathToRevalidate: string;
  },
  _formData: FormData
) {
  const data = allowPhaseCheckInSchema.parse({
    phaseId: otherData.phaseId,
    ownerId: otherData.ownerId,
  });

  const isLeagueOwner = await prisma.league.findFirst({
    where: {
      ownerId: otherData.ownerId,
      phases: {
        some: {
          id: otherData.phaseId,
        },
      },
    },
  });

  if (!isLeagueOwner) {
    throw new Error("You are not the owner of this league");
  }

  const leaguePhase = await prisma.leaguePhase.update({
    where: {
      id: data.phaseId,
    },
    data: {
      startedAt: new Date().toISOString(),
    },
  });

  if (!leaguePhase.startDate) {
    await prisma.leaguePhase.update({
      where: {
        id: data.phaseId,
      },
      data: {
        startDate: new Date().toISOString(),
      },
    });
  }

  revalidatePath(otherData.pathToRevalidate);

  return leaguePhase;
}

export async function createLeague(
  otherData: {
    ownerId: string;
    pathToRevalidate: string;
  },
  formData: FormData
) {
  const data = createLeagueSchema.parse({
    ownerId: otherData.ownerId,
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: formData.get("startDate")
      ? new Date(formData.get("startDate") as string).toISOString()
      : null,
    endDate: formData.get("endDate")
      ? new Date(formData.get("endDate") as string).toISOString()
      : null,
    minParticipants: formData.get("minParticipants")
      ? Number(formData.get("minParticipants"))
      : null,
    maxParticipants: formData.get("maxParticipants")
      ? Number(formData.get("maxParticipants"))
      : null,
    phasesFrequency: formData.get("phasesFrequency") ?? "monthly",
  });

  const response = await prisma.league.create({
    data,
  });

  revalidatePath(otherData.pathToRevalidate);

  return response;
}

export async function deleteLeague(
  otherData: {
    id: string;
    ownerId: string;
    pathToRevalidate: string;
  },
  _formData: FormData
) {
  const data = deleteLeagueSchema.parse({
    id: otherData.id,
    ownerId: otherData.ownerId,
  });

  const response = await prisma.league.delete({
    where: data,
  });

  revalidatePath(otherData.pathToRevalidate);

  return response;
}

export async function createLeaguePhase(
  otherData: {
    ownerId: string;
    leagueId: string;
    pathToRevalidate: string;
  },
  formData: FormData
) {
  const isLeagueOwner = await prisma.league.findFirst({
    where: {
      id: otherData.leagueId,
      ownerId: otherData.ownerId,
    },
  });

  if (!isLeagueOwner) {
    throw new Error("You are not the owner of this league");
  }

  const data = createLeaguePhaseSchema.parse({
    leagueId: otherData.leagueId,
    name: formData.get("name"),
    description: formData.get("description"),
    isProxyValid: formData.get("isProxyValid") === "true",
    requestCommanderForCheckIn:
      formData.get("requestCommanderForCheckIn") === "true",
    startDate: formData.get("startDate")
      ? new Date(formData.get("startDate") as string).toISOString()
      : null,
  });

  const response = await prisma.leaguePhase.create({
    data,
  });

  revalidatePath(otherData.pathToRevalidate);

  return response;
}
