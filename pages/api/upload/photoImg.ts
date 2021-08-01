import apiRoute from "src/lib/route";
import prisma from "src/lib/prisma";
import multer from "multer";
import { NextApiRequest } from "next";
import fs from "fs";

const uploadPhotos = multer({
  storage: multer.diskStorage({
    destination: "./public/photoImg",
    filename: (req, file, cb) =>
      cb(null, `${Math.floor(Math.random() * 1000000)}_${file.originalname}`),
  }),
});

const route = apiRoute();

export interface IFilesRequest extends NextApiRequest {
  files: {
    path: string;
  }[];
}

route
  .use(uploadPhotos.array("photoImg"))
  .post<IFilesRequest>(async (req, res) => {
    const { summary } = req.body;

    await prisma.photoSummary.createMany({
      data: req.files.map((f) => {
        const imageUrl = f.path.substr(6);
        return {
          imageUrl,
          summary,
        };
      }),
    });

    res.status(200).json({ success: true });
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    const deletePhoto = await prisma.photoSummary.delete({
      where: {
        id: Number(id),
      },
    });

    fs.unlinkSync(`./public/${deletePhoto.imageUrl}`);

    res.status(200).json(deletePhoto);
  });

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
