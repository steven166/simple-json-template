"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var missing_token_error_1 = require("../errors/missing-token.error");
var StringHelper = (function () {
    function StringHelper() {
    }
    StringHelper.readUntil = function (text, char) {
        var escaping = false;
        var stringBuilder = [];
        for (var index = 0; index < text.length; index++) {
            var c = text[index];
            if (escaping) {
                escaping = false;
                stringBuilder.push(c);
            }
            else if (c === StringHelper.ESCAPE_CHAR) {
                escaping = true;
                continue;
            }
            else if (char === c) {
                return {
                    text: stringBuilder.join(""),
                    length: index
                };
            }
            else {
                stringBuilder.push(c);
            }
        }
        throw new missing_token_error_1.MissingTokenError(char, text);
    };
    StringHelper.ESCAPE_CHAR = "\\";
    return StringHelper;
}());
exports.StringHelper = StringHelper;
