import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    const data = await prisma.collection.findFirstOrThrow({
      where: { userId },
      include: {
        _count: true,
        labels: {
          include: {
            entities: {
              include: {
                completionInstances: true,
                label: true,
                attachments: {
                  select: {
                    data: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
