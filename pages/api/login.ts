import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
import prisma from "../../src/lib/prisma";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pw } = req.body;

  const result = await prisma.user.findFirst({
    where: {
      pw,
    },
  });

  if (result) {
    res.json({
      success: true,
    });
  }

  res.json({
    success: false,
  });
};

export default loginHandler;
