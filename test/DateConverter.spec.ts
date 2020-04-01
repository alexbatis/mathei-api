// /*--------------------THIRD PARTY-------------------*/
// import "./../src/common/env";
// import "mocha";
// import { ObjectId } from "bson";
// import { expect } from "chai";
// import L from "../src/common/logger";
// import Server from "../src/common/server";
// /*--------------------CUSTOM-------------------*/
// import routes from "../src/routes";
// import ExpressServer from "../src/common/server";
// import app from "../src/index";
// import { DateConverter } from "./../src/models/DateConverter";

// before(done => {
//     // connect to database before running tests
//     const port = parseInt(process.env.PORT);
//     const app = new Server();
//     app.router(routes);
//     done();
// });

// describe("Date Converter", () => {

//     it("should serialize a date into a string", async () => {
//         const converter = new DateConverter();
//         const testDate = new Date(1995, 7, 13);
//         expect(converter.serialize(testDate)).to.equal(testDate.getFullYear() + "-" + (testDate.getMonth() + 1) + "-" + testDate.getDate());
//     });

// });