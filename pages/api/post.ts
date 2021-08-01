import apiRoute from "src/lib/route";
import prisma from "src/lib/prisma";

const route = apiRoute();

route
  .post(async (req, res) => {
    const { title, content } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    res.status(200).json(post);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const deletePost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletePost);
  })
  .patch(async (req, res) => {
    const { id, published } = req.body;

    const updatePost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        published: published,
      },
    });
    res.status(200).json({
      ...updatePost,
      createdAt: updatePost.createdAt.toString(),
      updatedAt: updatePost.updatedAt.toString(),
    });
  });

export default route;
