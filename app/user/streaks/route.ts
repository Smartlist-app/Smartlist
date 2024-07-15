import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

// Today's tasks
export async function GET() {
  try {
    const { userId } = await getIdentifiers();
    const data = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const tasks = await prisma.completionInstance.findMany({
      where: {
        completedAt: {
          gte: dayjs().startOf("day").utc().toDate(),
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
