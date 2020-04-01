/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import "reflect-metadata";
/* --------------------------------- CUSTOM --------------------------------- */
import { logger, ExpressServer } from "@common";


/* -------------------------------------------------------------------------- */
/*                              MAIN APPLICATION                              */
/* -------------------------------------------------------------------------- */
const app = new ExpressServer();         // Create application
app.connectToDB()                           // Connect to DB & start application
    .then(_ => app.listen())
    .catch(err => logger.error("Error connecting to database - ", err));
