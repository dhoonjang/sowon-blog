import multer from "multer";
import prisma from "src/lib/prisma";
import apiRoute from "src/lib/route";

const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: "./public/img",
    filename: (req, file, cb) =>
      cb(null, String(Math.random() * 1000000000000) + file.originalname),
  }),
});

const route = apiRoute();

export interface IFileRequest {
  file: {
    path: string;
  };
}

route
  .use(uploadProfile.single("editorImg"))
  .post<IFileRequest>(async (req, res) => {
    const imageUrl = req.file.path.substr(6);
    res.status(200).json({ success: true, path: imageUrl });
  });

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
