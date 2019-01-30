"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const info_controller_1 = require("./info.controller");
function infoRouter() {
    return express_1.default.Router().get('/', info_controller_1.getInfoHandler());
}
exports.default = infoRouter;
