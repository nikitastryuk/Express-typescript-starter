"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const database_1 = require("./database");
const server_1 = require("./server");
(async () => {
    try {
        if (!process.env.PORT) {
            throw new Error('PORT environment variable must be defined');
        }
        if (!process.env.NODE_ENV) {
            throw new Error('NODE_ENV environment variable must be defined');
        }
        await database_1.initDatabase();
        const server = new server_1.ExpressServer();
        console.log('before start');
        await server.start();
        console.log('after start and before stop');
        await server.stop();
        console.log('after stop');
    }
    catch (error) {
        console.log(error);
    }
})();
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error.message);
    process.exit(1);
});
process.on('SIGINT', async () => {
    console.log('sigint');
    await mongoose_1.default.connection.close();
    console.log('Mongoose connection is disconnected due to application termination');
    process.exit();
});
