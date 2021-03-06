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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheBlocks = exports.BatchSlots = exports.AddBlocksToCache = exports.GetLatestBlock = void 0;
var fs_jetpack_1 = require("fs-jetpack");
var Config_1 = require("../Config");
var Log_util_1 = require("../util/Log.util");
var Benchmark_util_1 = require("../util/Benchmark.util");
var Arweave_service_1 = require("./Arweave.service");
var ARQL_service_1 = require("./ARQL.service");
var Solana_rpc_service_1 = require("./Solana.rpc.service");
function GetLatestBlock() {
    return __awaiter(this, void 0, void 0, function () {
        var slotPayload, slot, blockPayload, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Solana_rpc_service_1.GetSlot()];
                case 1:
                    slotPayload = _a.sent();
                    slot = slotPayload.body.result;
                    return [4 /*yield*/, Solana_rpc_service_1.GetBlock(slot)];
                case 2:
                    blockPayload = _a.sent();
                    block = blockPayload.body.result;
                    return [2 /*return*/, block];
            }
        });
    });
}
exports.GetLatestBlock = GetLatestBlock;
function AddBlocksToCache(Blocks, type) {
    if (type === void 0) { type = 'standard'; }
    return __awaiter(this, void 0, void 0, function () {
        var File_1, Data, _loop_1, i, state_1, transactions, i, Block, Slot, transaction, i_1, tx, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    if (!Config_1.SolarweaveConfig.local) return [3 /*break*/, 1];
                    File_1 = fs_jetpack_1.read(Config_1.SolarweaveConfig.localFile);
                    Data = File_1 ? JSON.parse(File_1) : [];
                    _loop_1 = function (i) {
                        var Block = Blocks[i].Block;
                        if (Config_1.SolarweaveConfig.verify) {
                            if (Data.filter(function (block) { return block.blockhash === Block.blockhash; }).length > 0) {
                                return { value: (("Block #" + (Block.parentSlot + 1) + " " + Block.blockhash + " has already been cached").yellow) };
                            }
                        }
                        Data.unshift(Block);
                        fs_jetpack_1.write(Config_1.SolarweaveConfig.localFile, JSON.stringify(Data, null, 2));
                        Log_util_1.Log("Locally Cached Solana Block with Parent Slot ".green + ("#" + Block.parentSlot).green.bold);
                        Log_util_1.Log("Block Hash: ".green + (Block.blockhash + "\n").green.bold);
                    };
                    for (i = 0; i < Blocks.length; i++) {
                        state_1 = _loop_1(i);
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                    }
                    return [3 /*break*/, 8];
                case 1:
                    transactions = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < Blocks.length)) return [3 /*break*/, 6];
                    Block = Blocks[i].Block;
                    Slot = Blocks[i].Slot;
                    if (!Config_1.SolarweaveConfig.verify) return [3 /*break*/, 4];
                    return [4 /*yield*/, ARQL_service_1.RetrieveBlockhash(Block.blockhash, type === 'standard' ? Config_1.SolarweaveConfig.database : Config_1.SolarweaveConfig.database + '-index')];
                case 3:
                    if (_a.sent()) {
                        return [2 /*return*/, (("Block #" + (Block.parentSlot + 1) + " " + Block.blockhash + " has already been cached " + (type === 'index' ? 'to the index database' : '')).yellow)];
                    }
                    _a.label = 4;
                case 4:
                    transaction = {
                        tags: {
                            database: Config_1.SolarweaveConfig.database + (type === 'index' ? '-index' : ''),
                            parentSlot: Block.parentSlot.toString(),
                            slot: Slot.toString(),
                            blockhash: Block.blockhash,
                            transactions: [],
                        },
                        payload: Block,
                    };
                    for (i_1 = 0; i_1 < Block.transactions.length; i_1++) {
                        tx = Block.transactions[i_1];
                        transaction.tags.transactions.push({
                            signatures: tx.transaction.signatures,
                            accountKeys: tx.transaction.message.accountKeys,
                            programIdIndex: tx.transaction.message.instructions.map(function (instruction) { return instruction.programIdIndex; }),
                            numReadonlySignedAccounts: tx.transaction.message.header.numReadonlySignedAccounts,
                            numReadonlyUnsignedAccounts: tx.transaction.message.header.numReadonlyUnsignedAccounts,
                            numRequiredSignatures: tx.transaction.message.header.numRequiredSignatures,
                        });
                    }
                    transactions.push(transaction);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6: return [4 /*yield*/, Arweave_service_1.SubmitBlocksToArweave(transactions, type)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    Benchmark_util_1.LogBenchmark('cache_block');
                    return [2 /*return*/, null];
                case 9:
                    error_1 = _a.sent();
                    return [2 /*return*/, (error_1.message)];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.AddBlocksToCache = AddBlocksToCache;
function BatchSlots(Slots, size) {
    var Batches = [];
    for (var i = 0; i < Slots.length; i += size) {
        var batch = Slots.slice(i, i + size);
        Batches.push(batch);
    }
    return Batches;
}
exports.BatchSlots = BatchSlots;
function CacheBlocks(Slots, type) {
    if (type === void 0) { type = 'standard'; }
    return __awaiter(this, void 0, void 0, function () {
        var Batches, Blocks, i, Batch, Result, ii, Item, Block, Slot, Error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Batches = BatchSlots(Slots, Math.ceil(Slots.length / Config_1.SolarweaveConfig.batch));
                    Blocks = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < Batches.length)) return [3 /*break*/, 4];
                    Batch = Batches[i];
                    return [4 /*yield*/, Solana_rpc_service_1.GetBlocks(Batch)];
                case 2:
                    Result = _a.sent();
                    for (ii = 0; ii < Result.body.length; ii++) {
                        Item = Result.body[ii];
                        Block = Item.result;
                        Slot = Item.id;
                        Blocks.push({ Block: Block, Slot: Slot });
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(Blocks.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, AddBlocksToCache(Blocks, type)];
                case 5:
                    Error_1 = _a.sent();
                    if (Error_1) {
                        Log_util_1.Log(Error_1);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    Log_util_1.Log("Solarweave did not submit any blocks to Arweave on the last query".yellow);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.CacheBlocks = CacheBlocks;
//# sourceMappingURL=Solana.scanner.service.js.map