"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInfoHandler() {
    return async (_req, res) => {
        res.send({
            name: 'Express-typescript-starter',
            serverDateTime: new Date().toISOString(),
        });
    };
}
exports.getInfoHandler = getInfoHandler;
