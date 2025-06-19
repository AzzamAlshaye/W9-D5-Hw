"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const ulid_1 = require("ulid");
// Create a ULID generator that produces strictly increasing IDs,
// even when called multiple times in the same millisecond
const ulid = (0, ulid_1.monotonicFactory)();
/**
 * generateId
 * -------------
 * Returns a new unique identifier string each time it's called.
 * Under the hood, ULID provides:
 *  - lexicographically sortable IDs (good for ordered storage)
 *  - collision resistance across calls
 */
const generateId = () => {
    return ulid(); // produce and return the next ULID
};
exports.generateId = generateId;
