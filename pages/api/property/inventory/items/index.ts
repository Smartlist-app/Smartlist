import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const item = await prisma.item.findFirstOrThrow({
      where: {
        id: req.query.id,
      },
      include: {
        property: {
          select: { name: true, id: true },
        },
        room: {
          select: { name: true, id: true, emoji: true, private: true },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
            username: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });

    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default handler;
