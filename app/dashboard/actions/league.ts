"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createLeagueSchema = z.object({
  ownerId: z.string(),
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(5000).nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  minParticipants: z.number().min(0).nullable(),
  maxParticipants: z.number().min(0).nullable(),
  phasesFrequency: z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
  ]),
});

const deleteLeagueSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
});

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
    minParticipants: formData.get("minParticipants"),
    maxParticipants: formData.get("maxParticipants"),
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
