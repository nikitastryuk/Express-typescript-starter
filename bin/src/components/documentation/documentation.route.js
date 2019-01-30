"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_json_1 = __importDefault(require("../../../specification/openapi.json"));
function documentationRouter() {
    return express_1.default.Router().use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_json_1.default));
}
exports.default = documentationRouter;
