import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    await prisma.board.updateMany({
      data: {
        pinned: false,
      },
      where: {
        propertyId: req.query.property,
      },
    });

    const data = await prisma.board.update({
      data: {
        pinned: req.query.pinned === "true",
      },
      where: {
        id: req.query.id,
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
