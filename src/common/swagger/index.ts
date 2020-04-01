/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import * as middleware from "swagger-express-middleware";
import { Application } from "express";
import * as path from "path";
/* --------------------------------- CUSTOM --------------------------------- */
import { routes } from "../../api/routes";


/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */
export const swaggerify = function (app: Application) {
  middleware(path.join(__dirname, "Api.yaml"), app, (err, middleware) => {
    app.use(middleware.files(app, {
      apiPath: process.env.SWAGGER_API_SPEC,
    }));
    routes(app);
  });
};
