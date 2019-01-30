"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connection
    .once('open', () => console.info('Sucessfully connected to database'))
    .on('error', () => {
    throw new Error('Unable to connect to database');
});
async function initDatabase() {
    if (process.env.NODE_ENV === 'dev') {
        mongoose_1.default.set('debug', true);
    }
    if (!process.env.DB) {
        throw new Error('DB environment variable must be defined');
    }
    await mongoose_1.default.connect(process.env.DB, { useNewUrlParser: true });
}
exports.initDatabase = initDatabase;
