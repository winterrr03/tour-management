import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import { generateTourCode } from "../../helpers/generate.helper";
import TourCategory from "../../models/tour-category.model";
import { systemConfig } from "../../config/system";

// [GET] /admin/tours/
export const index = async (req: Request, res: Response) => {
  // SELECT * FROM tours WHERE deleted = false;
  const tours = await Tour.findAll({
    where: {
      deleted: false,
    },
    raw: true,
  });

  tours.forEach((item) => {
    if (item["images"]) {
      const images = JSON.parse(item["images"]);
      item["image"] = images[0];
    }
    item["price_special"] = item["price"] * (1 - item["discount"] / 100);
  });

  res.render("admin/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours,
  });
};

// [GET] /admin/tours/create
export const create = async (req: Request, res: Response) => {
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: "active",
    },
    raw: true,
  });

  res.render("admin/pages/tours/create", {
    pageTitle: "Thêm mới tour",
    categories: categories,
  });
};

// [POST] /admin/tours/create
export const createPost = async (req: Request, res: Response) => {
  if (!req.body.position) {
    const countTour = await Tour.count();
    req.body.position = countTour + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const dataTour = {
    title: req.body.title,
    code: "",
    images: JSON.stringify(req.body.images),
    price: parseInt(req.body.price),
    discount: parseInt(req.body.discount),
    timeStart: req.body.timeStart,
    stock: parseInt(req.body.stock),
    status: req.body.status,
    position: req.body.position,
  };

  const tour = await Tour.create(dataTour);
  const tourId = tour.dataValues.id;

  const code = generateTourCode(tourId);

  await Tour.update(
    {
      code: code,
    },
    {
      where: {
        id: tourId,
      },
    }
  );

  const dataTourCategory = {
    tour_id: tourId,
    category_id: parseInt(req.body.category_id),
  };

  await TourCategory.create(dataTourCategory);

  res.redirect(`/${systemConfig.prefixAdmin}/tours`);
};
