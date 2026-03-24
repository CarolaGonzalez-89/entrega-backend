import { Router } from "express";
import { productModel } from "../model/productModel.js";

const router = Router();

router.get("/", async (req, res) => {
  const { page = 1 } = req.query;
  const pagination = await productModel.paginate(
    {},
    {
      limit: 2,
      page: page,
      sort: { price: 1 },
      lean: true,
    },
  );
  res.render("home", {
    pagination,
    styles: { main: "/css/main.css", products: "/css/products.css" },
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});
export default router;
