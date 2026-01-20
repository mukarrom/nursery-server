import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { carouselRoutes } from "../modules/carousel/carousel.route";
import { categoryRoutes } from "../modules/category/category.route";
import { flashSaleRoutes } from "../modules/flash-sale/flash-sale.route";
import { productRoutes } from "../modules/products/products.route";
import { testRoutes } from "../modules/tests/tests.route";

const router = Router();
interface IModuleRoutes {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoutes[] = [
  { path: "/tests", route: testRoutes },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/carousels",
    route: carouselRoutes,
  },
  {
    path: "/flash-sales",
    route: flashSaleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
