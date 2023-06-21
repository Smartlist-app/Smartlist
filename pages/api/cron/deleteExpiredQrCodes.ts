import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";

const handler = async (req, res) => {
  await prisma.qrToken.deleteMany({
    where: {
      expires: {
        lt: dayjs().subtract(1, "day").toDate(),
      },
    },
  });
};

export default handler;