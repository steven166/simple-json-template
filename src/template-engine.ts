/**
 * Engine to render a Simple Json Template
 */
import { ReadResult, StringHelper } from "./helpers/string.helper";
import { ScopeModel } from "./models/scope.model";
import { VM } from "vm2";
import { EvalError, RenderError } from "./errors";

export class TemplateEngine {

  /**
   * Render template
   * @param template
   * @param {Object} context
   * @returns {any}
   */
  public static render(template: any, context?: object): any {
    let scope = {
      root: template,
      this: template,
      path: ""
    };
    return TemplateEngine.renderAny(template, context, scope);
  }

  public static renderAny(template: any, context: object, scope: ScopeModel): any {
    if (Array.isArray(template)) {
      return TemplateEngine.renderArray(template, context, scope);
    } else if (typeof(template) === "object") {
      return TemplateEngine.renderObject(template, context, scope);
    } else if (typeof(template) === "string") {
      return TemplateEngine.renderString(template, context, scope);
    } else {
      return template;
    }
  }

  private static renderArray(template: any[], context: object, scope: ScopeModel): any {
    let result: any[] = [];
    template.forEach((item: any, index: number) => {
      let newScope: ScopeModel = {
        root: scope.root,
        this: template,
        path: scope.path ? scope.path + "." + index : index + ""
      };

      let renderedItem = TemplateEngine.renderAny(item, context, newScope);
      result.push(renderedItem);
    });
    return result;
  }

  private static renderObject(template: any, context: object, scope: ScopeModel): any {
    let result: any = {};
    Object.keys(template).forEach((property: string) => {
      let newScope = {
        root: scope.root,
        this: template,
        path: scope.path ? scope.path + "." + property : property
      };

      let value = template[property];
      result[property] = TemplateEngine.renderAny(value, context, newScope);
    });
    return result;
  }

  /**
   * Render string and parse expressions in the format: ${...}
   * @param {string} template
   * @param {Object} context
   * @param {ScopeModel} scope
   * @returns {any}
   */
  private static renderString(template: string, context: object, scope: ScopeModel): any {
    let stringBuilder: string[] = [];
    for (let i = 0; i < template.length; i++) {
      if (i + 1 < template.length && template[i] === "$" && template[i + 1] === "{") {
        let remaining = template.substr(i + 2);
        let readResult: ReadResult;
        try {
          readResult = StringHelper.readUntil(remaining, "}");
        } catch (e) {
          throw new RenderError(e, scope.path);
        }

        i += readResult.length + 2;
        let expression = readResult.text;

        let resolvedValue = TemplateEngine.evalExpression(expression, scope);
        if (resolvedValue !== undefined && resolvedValue !== null) {
          stringBuilder.push(resolvedValue + "");
        }
      } else {
        stringBuilder.push(template[i]);
      }
    }
    return stringBuilder.join("");
  }

  /**
   * Execute expression
   * @param {string} expression
   * @param scope
   * @throws EvalError
   */
  private static evalExpression(expression: string, scope: ScopeModel): any {
    let vm = new VM({
      timeout: 100,
      sandbox: {
        _this: scope.this,
        _root: scope.root,
        _path: scope.path
      }
    });
    try {
      return vm.run(expression);
    } catch (e) {
      throw new RenderError(new EvalError(e, expression), scope.path);
    }
  }

}