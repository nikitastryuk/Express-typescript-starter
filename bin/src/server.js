"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const documentation_route_1 = __importDefault(require("./components/documentation/documentation.route"));
const info_route_1 = __importDefault(require("./components/info/info.route"));
class ExpressServer {
    constructor() {
        this._application = express_1.default();
        this.init();
    }
    async start() {
        return new Promise((resolve, _reject) => {
            this._server = this._application.listen(process.env.PORT, () => {
                console.log(`Listening on port ${process.env.PORT}`);
                resolve();
            });
        }).catch(err => {
            throw err;
        });
    }
    async stop() {
        console.log('in stop before mongo close');
        await mongoose_1.default.connection.close();
        console.log('in stop after mongo close');
        this._server.close();
    }
    init() {
        this.initDefaultMiddlewares();
        this.initRoutes();
    }
    initDefaultMiddlewares() {
        this._application.use(body_parser_1.default.json());
    }
    initRoutes() {
        this._application.use(info_route_1.default());
        this._application.use(documentation_route_1.default());
    }
}
exports.ExpressServer = ExpressServer;
