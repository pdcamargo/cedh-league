import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

type LeagueData = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  maxParticipants?: number;
  minParticipants?: number;
  phasesFrequency:
    | "weekly"
    | "fortnightly"
    | "monthly"
    | "quarterly"
    | "yearly";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  startDate?: string;
  finishedAt?: string;
  endDate?: string;
};

const createLeagueTableIfNotExists = async () => {
  await sql`
        CREATE TABLE IF NOT EXISTS leagues (
            id uuid PRIMARY KEY,
            name text NOT NULL,
            description text DEFAULT NULL,
            ownerId text NOT NULL,
            maxParticipants integer DEFAULT NULL,
            minParticipants integer NOT NULL DEFAULT 0,
            phasesFrequency text NOT NULL DEFAULT 'monthly',
            deletedAt timestamp DEFAULT NULL,
            startDate timestamp DEFAULT NULL,
            endDate timestamp DEFAULT NULL,
            finishedAt timestamp DEFAULT NULL,
            createdAt timestamp NOT NULL DEFAULT NOW(),
            updatedAt timestamp NOT NULL DEFAULT NOW()
        );
    `;
};

const createLeague = async (leagueData: LeagueData) => {
  const { phasesFrequency } = leagueData;

  if (
    !["weekly", "fortnightly", "monthly", "quarterly", "yearly"].includes(
      phasesFrequency
    )
  ) {
    throw new Error("Invalid phases frequency");
  }

  await createLeagueTableIfNotExists();

  return await sql`
            INSERT INTO leagues (
                id,
                name,
                description,
                ownerId,
                maxParticipants,
                minParticipants,
                phasesFrequency,
                createdAt,
                startDate,
                endDate,
                finishedAt
            ) VALUES (
                ${leagueData.id},
                ${leagueData.name},
                ${leagueData.description ?? null},
                ${leagueData.ownerId},
                ${leagueData.maxParticipants ?? null},
                ${leagueData.minParticipants ?? 0},
                ${leagueData.phasesFrequency ?? "monthly"},
                ${leagueData.createdAt ?? null},
                ${leagueData.startDate ?? null},
                ${leagueData.endDate ?? null},
                ${leagueData.finishedAt ?? null}
            );
        `;
};

const getLeagueByName = async (name: string) => {
  await createLeagueTableIfNotExists();

  return await sql`
    SELECT * FROM leagues WHERE name = ${name};
  `;
};

const getLeaguesByOwnerId = async (ownerId: string) => {
  await createLeagueTableIfNotExists();

  return await sql`
    SELECT * FROM leagues WHERE ownerId = ${ownerId};
  `;
};

const getLeagueById = async (id: string) => {
  await createLeagueTableIfNotExists();

  return await sql`
    SELECT * FROM leagues WHERE id = ${id};
  `;
};

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const GET = withApiAuthRequired(async (req) => {
  const res = new NextResponse();

  const { user } = (await getSession(req, res)) ?? {};

  const ownerId = user?.sub;

  if (!ownerId) {
    throw new Error("User not found");
  }

  let result = await getLeaguesByOwnerId(ownerId);

  let leagues = result.rows;

  if (leagues.length === 0) {
    await createLeague({
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      name: "Test League",
      ownerId,
      phasesFrequency: "monthly",
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
      description: "Test League Description",
      endDate: undefined,
      finishedAt: undefined,
      maxParticipants: undefined,
      minParticipants: 0,
      startDate: undefined,
    });
  }

  result = await getLeaguesByOwnerId(ownerId);

  leagues = result.rows;

  return NextResponse.json({ leagues }, { status: 200 });
});

export const POST = withApiAuthRequired(async (req) => {
  const res = new NextResponse();

  const { user } = (await getSession(req, res)) ?? {};

  const ownerId = user?.sub;

  if (!ownerId) {
    throw new Error("User not found");
  }

  const id = generateUUID();

  try {
    const {
      name,
      description,
      maxParticipants,
      minParticipants,
      phasesFrequency,
      startDate,
      endDate,
      finishedAt,
    } = (await req.json()) as Partial<LeagueData>;

    if (!name) {
      throw new Error("Name is required");
    }

    const leagueData: LeagueData = {
      id,
      name,
      description,
      ownerId,
      maxParticipants,
      minParticipants,
      phasesFrequency: phasesFrequency ?? "monthly",
      startDate,
      endDate,
      finishedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createLeague(leagueData);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const league = await getLeagueById(id);

  return NextResponse.json({ league }, { status: 200 });
});
