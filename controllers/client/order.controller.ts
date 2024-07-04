import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate.helper";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";

// [POST] /order/
export const order = async (req: Request, res: Response) => {
  const data = req.body;

  const dataOrder = {
    code: "",
    fullName: data.info.fullName,
    phone: data.info.phone,
    note: data.info.note,
    status: "initial",
  };

  const order = await Order.create(dataOrder);
  const orderId = order.dataValues.id;

  const code = generateOrderCode(orderId);

  await Order.update(
    {
      code: code,
    },
    {
      where: {
        id: orderId,
      },
    }
  );

  for (const item of data.cart) {
    const dataOrderItem = {
      orderId: orderId,
      tourId: item.tourId,
      quantity: item.quantity,
    };

    const tourInfo = await Tour.findOne({
      where: {
        id: item.tourId,
        deleted: false,
        status: "active",
      },
      raw: true,
    });

    dataOrderItem["price"] = tourInfo["price"];
    dataOrderItem["discount"] = tourInfo["discount"];
    dataOrderItem["timeStart"] = tourInfo["timeStart"];

    await OrderItem.create(dataOrderItem);
  }

  res.json({
    code: 200,
    message: "Đặt hàng thành công!",
    orderCode: code,
  });
};

// [GET] /order/success
export const success = async (req: Request, res: Response) => {
  const orderCode = req.query.orderCode;

  const order = await Order.findOne({
    where: {
      code: orderCode,
      deleted: false,
    },
    raw: true,
  });

  const ordersItem = await OrderItem.findAll({
    where: {
      orderId: order["id"],
    },
    raw: true,
  });

  let totalPrice = 0;

  for (const item of ordersItem) {
    item["price_special"] = item["price"] * (1 - item["discount"] / 100);
    item["total"] = item["price_special"] * item["quantity"];
    totalPrice += item["total"];

    const infoTour = await Tour.findOne({
      where: {
        id: item["tourId"],
        deleted: false,
        status: "active",
      },
      raw: true,
    });

    if (infoTour["images"]) {
      infoTour["images"] = JSON.parse(infoTour["images"]);
      item["image"] = infoTour["images"][0];
    }

    item["title"] = infoTour["title"];
    item["slug"] = infoTour["slug"];
  }

  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    ordersItem: ordersItem,
    totalPrice: totalPrice,
  });
};
