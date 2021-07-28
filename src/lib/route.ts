import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const apiRoute = () =>
  nextConnect({
    // Handle any other HTTP method
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

export default apiRoute;
