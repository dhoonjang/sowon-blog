import { NextApiRequest, NextApiResponse } from "next";
import prisma from "src/lib/prisma";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pw } = req.body;

  const result = await prisma.user.findFirst({
    where: {
      pw,
    },
  });

  if (result) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
};

export default loginHandler;
