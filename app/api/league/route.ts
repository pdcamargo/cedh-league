import { NextResponse } from "next/server";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async (req) => {
  const res = new NextResponse();

  const { user } = (await getSession(req, res)) ?? {};

  const ownerId = user?.sub;

  if (!ownerId) {
    throw new Error("User not found");
  }

  let result = {
    rows: [],
  };

  let leagues = result.rows;

  //   if (leagues.length === 0) {
  //     await createLeague({
  //       id: generateUUID(),
  //       createdAt: new Date().toISOString(),
  //       name: "Test League",
  //       ownerId,
  //       phasesFrequency: "monthly",
  //       updatedAt: new Date().toISOString(),
  //       deletedAt: undefined,
  //       description: "Test League Description",
  //       endDate: undefined,
  //       finishedAt: undefined,
  //       maxParticipants: undefined,
  //       minParticipants: 0,
  //       startDate: undefined,
  //     });
  //   }

  //   result = await getLeaguesByOwnerId(ownerId);

  //   leagues = result.rows;

  return NextResponse.json({ leagues }, { status: 200 });
});

export const POST = withApiAuthRequired(async (req) => {
  return NextResponse.json({ league: {} }, { status: 200 });
});
