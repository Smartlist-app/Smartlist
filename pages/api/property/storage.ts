import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { getItemCount } from "./inventory/count";

const handler = async (req, res) => {
  try {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    //  List all boards with columns, but not items
    const tasks = await prisma.task.count({
      where: {
        propertyId: req.query.property,
      },
    });

    const itemCount = await getItemCount(
      res,
      req.query.property,
      req.query.accessToken
    );

    res.json({
      tasks,
      items: itemCount,
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
