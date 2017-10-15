"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_helper_1 = require("./helpers/string.helper");
var vm2_1 = require("vm2");
var errors_1 = require("./errors");
var TemplateEngine = (function () {
    function TemplateEngine() {
    }
    TemplateEngine.render = function (template, context) {
        var scope = {
            root: template,
            this: template,
            path: ""
        };
        return TemplateEngine.renderAny(template, context, scope);
    };
    TemplateEngine.renderAny = function (template, context, scope) {
        if (Array.isArray(template)) {
            return TemplateEngine.renderArray(template, context, scope);
        }
        else if (typeof (template) === "object") {
            return TemplateEngine.renderObject(template, context, scope);
        }
        else if (typeof (template) === "string") {
            return TemplateEngine.renderString(template, context, scope);
        }
        else {
            return template;
        }
    };
    TemplateEngine.renderArray = function (template, context, scope) {
        var result = [];
        template.forEach(function (item, index) {
            var newScope = {
                root: scope.root,
                this: template,
                path: scope.path ? scope.path + "." + index : index + ""
            };
            var renderedItem = TemplateEngine.renderAny(item, context, newScope);
            result.push(renderedItem);
        });
        return result;
    };
    TemplateEngine.renderObject = function (template, context, scope) {
        var result = {};
        Object.keys(template).forEach(function (property) {
            var newScope = {
                root: scope.root,
                this: template,
                path: scope.path ? scope.path + "." + property : property
            };
            var value = template[property];
            result[property] = TemplateEngine.renderAny(value, context, newScope);
        });
        return result;
    };
    TemplateEngine.renderString = function (template, context, scope) {
        var stringBuilder = [];
        for (var i = 0; i < template.length; i++) {
            if (i + 1 < template.length && template[i] === "$" && template[i + 1] === "{") {
                var remaining = template.substr(i + 2);
                var readResult = void 0;
                try {
                    readResult = string_helper_1.StringHelper.readUntil(remaining, "}");
                }
                catch (e) {
                    throw new errors_1.RenderError(e, scope.path);
                }
                i += readResult.length + 2;
                var expression = readResult.text;
                var resolvedValue = TemplateEngine.evalExpression(expression, scope);
                if (resolvedValue !== undefined && resolvedValue !== null) {
                    stringBuilder.push(resolvedValue + "");
                }
            }
            else {
                stringBuilder.push(template[i]);
            }
        }
        return stringBuilder.join("");
    };
    TemplateEngine.evalExpression = function (expression, scope) {
        var vm = new vm2_1.VM({
            timeout: 100,
            sandbox: {
                _this: scope.this,
                _root: scope.root,
                _path: scope.path
            }
        });
        try {
            return vm.run(expression);
        }
        catch (e) {
            throw new errors_1.RenderError(new errors_1.EvalError(e, expression), scope.path);
        }
    };
    return TemplateEngine;
}());
exports.TemplateEngine = TemplateEngine;
