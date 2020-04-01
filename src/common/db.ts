/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import * as mongoose from "mongoose";
/* --------------------------------- CUSTOM --------------------------------- */
import { logger } from "@common";


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
export class MongoDatabase {

    /* --------------------------------- METHODS -------------------------------- */
    async connect(): Promise<boolean> {
        // Grab credentials & server information from environment configuration
        const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env,
            userPassCombination = (MONGO_USER && MONGO_PASS) ? `${MONGO_USER}:${MONGO_PASS}@` : "",
            mongoUrl = `mongodb://${userPassCombination}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
            connectionOptions = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: true
            };

        // Connect to MongoDB
        logger.info(`Connecting to mongodb at ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

        await mongoose.connect(mongoUrl, connectionOptions);

        logger.info(`Connected to mongodb at ${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);
        return true;
    }

}

// Exported Instance
export const mongoDatabase = new MongoDatabase();
