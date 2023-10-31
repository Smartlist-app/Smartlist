import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.propertyInvite.findMany({
      where: {
        AND: [
          { propertyId: { equals: req.query.id } },
          { accessToken: { equals: req.query.propertyAccessToken } },
        ],
      },
      include: {
        profile: {
          include: {
            members: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    Profile: {
                      select: { picture: true },
                    },
                    email: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 1,
    });

    res.json(data[0]);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
