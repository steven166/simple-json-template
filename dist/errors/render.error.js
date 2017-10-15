"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RenderError = (function (_super) {
    __extends(RenderError, _super);
    function RenderError(cause, path) {
        var _this = _super.call(this, cause.message + " at '" + path + "'") || this;
        _this.cause = cause;
        Object.setPrototypeOf(_this, RenderError.prototype);
        return _this;
    }
    return RenderError;
}(Error));
exports.RenderError = RenderError;
