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
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const KoaRouter = require("koa-router");
// import Distribution from './middleware/distribution'
const koa = new Koa();
const router = new KoaRouter();
router.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'hello world!!';
}));
const resoucess = new KoaRouter();
resoucess.get('/resoucess', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = '1';
}));
// koa.use(Distribution)
koa.use(router.routes());
koa.use(resoucess.routes());
koa.listen(3000);
//# sourceMappingURL=app.js.map