import { NextApiRequest, NextApiResponse } from "next";
import prisma from "src/lib/prisma";
import apiRoute from "src/lib/route";

const route = apiRoute();

route.post(async (req: NextApiRequest, res: NextApiResponse) => {
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
    res.status(201).json({
      success: false,
    });
  }
});

export default route;
