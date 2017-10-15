"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_engine_1 = require("./template-engine");
var chai_1 = require("chai");
describe("TemplateEngine", function () {
    it("render flat object", function () {
        var template = {
            name: "first template",
            age: 69,
            male: true
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            name: "first template",
            age: 69,
            male: true
        });
    });
    it("render nexted object", function () {
        var template = {
            name: "first template",
            age: 69,
            male: true,
            childeren: [
                {
                    name: "fred"
                },
                {
                    name: "henk"
                }
            ]
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            name: "first template",
            age: 69,
            male: true,
            childeren: [
                {
                    name: "fred"
                },
                {
                    name: "henk"
                }
            ]
        });
    });
    it("render string variable", function () {
        var template = {
            firstName: "John",
            lastName: "Jackson",
            name: "${_this.firstName} ${_this.lastName}"
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            firstName: "John",
            lastName: "Jackson",
            name: "John Jackson"
        });
    });
    it("render unknown string variable", function () {
        var template = {
            name: "${_this.firstName}"
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            name: ""
        });
    });
    it("render syntax error", function () {
        var template = {
            name: "${unknown_property}"
        };
        chai_1.assert.throw(function () {
            template_engine_1.TemplateEngine.render(template);
        }, "unknown_property is not defined in expression 'unknown_property' at 'name'");
    });
    it("render labda expression", function () {
        var template = {
            name: "${[5,6].map(value => \"a-\" + value).join(',')}"
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            name: "a-5,a-6"
        });
    });
    it("render ~~~if true then this", function () {
        var template = {
            '~~~if': "name === 'Awesome'",
            type: "Awesome"
        };
        var result = template_engine_1.TemplateEngine.render(template);
        chai_1.assert.deepEqual(result, {
            type: "Awesome"
        });
    });
});
