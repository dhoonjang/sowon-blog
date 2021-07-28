import multer from "multer";
import prisma from "src/lib/prisma";
import apiRoute from "src/lib/route";

const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: "./public/profileImg",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const route = apiRoute();

export interface IFileRequest {
  file: {
    path: string;
  };
}

route
  .use(uploadProfile.single("profileImg"))
  .post<IFileRequest>(async (req, res) => {
    const profileImageUrl = req.file.path.substr(6);

    await prisma.user.update({
      where: {
        id: 1,
      },
      data: {
        profileImageUrl,
      },
    });

    res.status(200).json({ success: true, path: profileImageUrl });
  })
  .delete(async (_, res) => {
    await prisma.user.update({
      where: {
        id: 1,
      },
      data: {
        profileImageUrl: null,
      },
    });

    res.status(202).json({ success: true });
  });

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
