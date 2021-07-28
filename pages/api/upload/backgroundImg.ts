import multer from "multer";
import prisma from "src/lib/prisma";
import apiRoute from "src/lib/route";

const uploadBackground = multer({
  storage: multer.diskStorage({
    destination: "./public/backgroundImg",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const route = apiRoute();

route.use(uploadBackground.single("backgroundImg"));

route.post(async (req: any, res) => {
  const bgImageUrl = req.file.path.substr(6);

  await prisma.user.update({
    where: {
      id: 1,
    },
    data: {
      bgImageUrl,
    },
  });

  res.status(200).json({ success: true, path: bgImageUrl });
});

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
