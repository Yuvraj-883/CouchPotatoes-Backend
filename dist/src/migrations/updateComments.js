"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = __importDefault(require("../models/comments"));
const constants_1 = require("../constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const updateComments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`${process.env.MONGO_URI}/${constants_1.DB_NAME}`);
        yield comments_1.default.updateMany({ parent_id: { $exists: false } }, { isParent: true });
        yield comments_1.default.updateMany({ parent_id: { $exists: true } }, { isParent: false });
        mongoose_1.default.connection.close();
    }
    catch (err) {
        console.log("Error while updating comments:", err);
    }
    finally {
        console.log(process.env.MONGO_URI);
    }
});
updateComments();
