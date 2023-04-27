"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
    routes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({ message: 'Hello World' });
        });
        router.post('/', (req, res) => {
            let bodyData = req.body;
            res.json(bodyData);
        });
        this.app.use('/', router);
    }
}
exports.default = new App().app;
