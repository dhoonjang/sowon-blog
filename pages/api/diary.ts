import apiRoute from "src/lib/route";
import prisma from "src/lib/prisma";

const route = apiRoute();

route
  .post(async (req, res) => {
    const { date, content } = req.body;

    const diary = await prisma.dateSummary.create({
      data: {
        date: new Date(date),
        content,
      },
    });
    res.status(200).json(diary);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const deleteDiary = await prisma.dateSummary.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deleteDiary);
  })
  .put(async (req, res) => {
    const { id, content } = req.body;
    const updateDiary = await prisma.dateSummary.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
    res.status(200).json(updateDiary);
  });

export default route;
