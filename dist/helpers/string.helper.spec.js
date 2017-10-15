"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var string_helper_1 = require("./string.helper");
describe("StringHelper", function () {
    describe("readUntil", function () {
        it("Read Until end", function () {
            var string = "hello!";
            var index = string_helper_1.StringHelper.readUntil(string, "!");
            chai_1.assert.deepEqual(index, {
                text: "hello",
                length: 5
            });
        });
        it("Read Until middle", function () {
            var string = "hello! By!";
            var index = string_helper_1.StringHelper.readUntil(string, "!");
            chai_1.assert.deepEqual(index, {
                text: "hello",
                length: 5
            });
        });
        it("Read Until unkown", function () {
            var string = "hello";
            chai_1.assert.throw(function () {
                string_helper_1.StringHelper.readUntil(string, "!");
            }, "Missing '!' after 'hello'");
        });
        it("Read nested brackets", function () {
            var string = "`${[5,6].map(value => \"a-\" + value).join(',')\\}`}";
            var index = string_helper_1.StringHelper.readUntil(string, "}");
            chai_1.assert.deepEqual(index, {
                text: "`${[5,6].map(value => \"a-\" + value).join(',')}`",
                length: string.length - 1
            });
        });
    });
});
