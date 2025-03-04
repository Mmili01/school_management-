"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const connectpg_1 = require("./db/connectpg");
const dotenv = __importStar(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const departmentRouter_1 = __importDefault(require("./routes/departmentRouter"));
const facultyRoutes_1 = __importDefault(require("./routes/facultyRoutes"));
const lecturerRoutes_1 = __importDefault(require("./routes/lecturerRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const assignmentRoute_1 = __importDefault(require("./routes/assignmentRoute"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.use("/authroute", authRoutes_1.default);
app.use("/department", departmentRouter_1.default);
app.use("/faculty", facultyRoutes_1.default);
app.use("/lecturer", lecturerRoutes_1.default);
app.use("/student", studentRoutes_1.default);
app.use("/assignment", assignmentRoute_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectpg_1.connection)();
        console.log("it has connected oo");
        app.listen(port, () => {
            console.log(`app connected on port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
