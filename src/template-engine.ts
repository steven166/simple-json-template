/**
 * Engine to render a Simple Json Template
 */
import { ReadResult, StringHelper } from "./helpers/string.helper";
import { ScopeModel } from "./models/scope.model";
import { VM } from "vm2";
import { EvalError, RenderError, SyntaxError } from "./errors";
import { ModelHelper } from "./helpers/model.helper";

const STATEMENT_IF = "~~~if";
const STATEMENT_THEN = "~~~then";
const STATEMENT_ELSE = "~~~else";

const STATEMENT_FOR = "~~~for";
const STATEMENT_EACH = "~~~each";

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

  private static renderAny(template: any, context: object, scope: ScopeModel, parent?: any, _this?: any): any {
    if (Array.isArray(template)) {
      return TemplateEngine.renderArray(template, context, scope, parent, _this);
    } else if (typeof(template) === "object") {
      return TemplateEngine.renderObject(template, context, scope, parent, _this);
    } else if (typeof(template) === "string") {
      return TemplateEngine.renderString(template, context, scope);
    } else {
      return template;
    }
  }

  private static renderArray(template: any[], context: object, scope: ScopeModel, parent: any, _this?: any): any {
    let result: any[] = [];
    let thisScope = template;
    if (_this) {
      thisScope = ModelHelper.merge(_this, template);
    }

    template.forEach((item: any, index: number) => {
      let newScope: ScopeModel = { ...scope };
      newScope.this = template;
      newScope.path = scope.path ? scope.path + "." + index : index + "";
      newScope.parent = parent;

      let renderedItem = TemplateEngine.renderAny(item, context, newScope, template);
      if (renderedItem !== undefined) {
        result.push(renderedItem);
      }
    });

    if (_this) {
      // Merge result
      result = ModelHelper.merge(_this, result);
    }

    return result;
  }

  private static renderObject(template: any, context: object, scope: ScopeModel, parent: any, _this?: any): any {
    let result: any = {};
    let thisScope = template;
    if (_this) {
      // Merge this scope
      thisScope = ModelHelper.merge(_this, template);
    }

    // Resolve ~~~for statements without ~~~each
    if (template.hasOwnProperty(STATEMENT_FOR) && !template.hasOwnProperty(STATEMENT_EACH)) {
      let forAsProperties = Object.keys(template).filter(property => property.indexOf("${") !== -1);

      // Normal loop and result array
      let newScope = { ...scope };
      newScope.this = thisScope;
      newScope.parent = parent;
      let renderedArray = TemplateEngine.renderFor(template, context, newScope, result, parent);

      if (forAsProperties.length === 0 || !Array.isArray(renderedArray)) {
        return renderedArray;
      } else {
        let mergedObject = {};
        renderedArray.forEach(item => mergedObject = ModelHelper.merge(mergedObject, item));
        return mergedObject;
      }

    } else {

      // Resolve properties
      Object.keys(template)
        .filter((property: string) => property.indexOf("~~~") !== 0)
        .forEach((property: string) => {
          let newScope = { ...scope };
          newScope.this = thisScope;
          newScope.path = scope.path ? scope.path + "." + property : property;
          newScope.parent = parent;

          let value = template[property];
          let renderedValue = TemplateEngine.renderAny(value, context, newScope, template);
          let renderedProperty = TemplateEngine.renderString(property, context, newScope);
          if (renderedValue !== undefined && renderedProperty !== undefined) {
            result[renderedProperty] = renderedValue;
          }
        });

      // Resolve ~~~if statements
      if (template.hasOwnProperty(STATEMENT_IF)) {
        let newScope = { ...scope };
        newScope.this = thisScope;
        newScope.parent = parent;
        result = TemplateEngine.renderIf(template, context, newScope, result, parent);
      }

      // Resolve ~~~for statements
      if (template.hasOwnProperty(STATEMENT_FOR)) {
        let newScope = { ...scope };
        newScope.this = thisScope;
        newScope.parent = parent;
        result = TemplateEngine.renderFor(template, context, newScope, result, parent);
      }

      if (_this) {
        // Merge result
        result = ModelHelper.merge(_this, result);
      }

      return result;
    }
  }

  private static renderIf(template: any, context: object, scope: ScopeModel, resultObject: any, parent: any): any {
    // Eval If expression
    let expression = template[STATEMENT_IF];
    let expressionScope = { ...scope };
    expressionScope.path = scope.path ? scope.path + "." + STATEMENT_IF : STATEMENT_IF;
    let result = TemplateEngine.evalExpression(expression, expressionScope);

    if (result) {
      // Then
      if (template.hasOwnProperty(STATEMENT_THEN)) {
        // Use ~~~then as result
        let thenScope = { ...scope };
        thenScope.path = scope.path ? scope.path + "." + STATEMENT_THEN : STATEMENT_THEN;
        return TemplateEngine.renderAny(template[STATEMENT_THEN], context, thenScope, parent, resultObject);
      } else {
        // Use current scope as result
        return resultObject;
      }

    } else {
      // Else
      if (template.hasOwnProperty(STATEMENT_ELSE)) {
        // Use ~~~else as result
        let elseScope = { ...scope };
        elseScope.path = scope.path ? scope.path + "." + STATEMENT_ELSE : STATEMENT_ELSE;
        return TemplateEngine.renderAny(template[STATEMENT_ELSE], context, elseScope, parent, resultObject);

      } else {
        // Use empty object as result
        return {};
      }

    }
  }

  private static renderFor(template: any, context: object, scope: ScopeModel, resultObject: any, parent: any): any[] {
    // Eval For expression
    let expression = template[STATEMENT_FOR];
    let expressionScope = { ...scope };
    expressionScope.path = scope.path ? scope.path + "." + STATEMENT_FOR : STATEMENT_FOR;
    let forExpression = TemplateEngine.evalForExpression(expression, expressionScope);

    let subTemplate;
    let subPath = [];
    if (scope.path) {
      subPath.push(scope.path);
    }
    if (template.hasOwnProperty(STATEMENT_EACH)) {
      subPath.push(STATEMENT_EACH);
      subTemplate = template[STATEMENT_EACH];
    } else {
      subTemplate = Object.assign({}, template);
      delete subTemplate[STATEMENT_FOR];
    }
    let results: any[] = [];
    for (let i = 0; i < forExpression.items.length; i++) {
      let eachScope: any = { ...scope };
      eachScope.path = subPath.join(".");
      if (forExpression.itemName) {
        eachScope[forExpression.itemName] = forExpression.items[i];
      }
      if (forExpression.indexName) {
        eachScope[forExpression.indexName] = i;
      }
      if (forExpression.lengthName) {
        eachScope[forExpression.lengthName] = forExpression.items.length;
      }

      let result = TemplateEngine.renderAny(subTemplate, context, eachScope, parent, resultObject);
      results.push(result);
    }
    return results;
  }

  /**
   * Render string and parse expressions in the format: ${...}
   * @param {string} template
   * @param {Object} context
   * @param {ScopeModel} scope
   * @returns {any}
   */
  private static renderString(template: string, context: object, scope: ScopeModel): any {
    let stringBuilder: any[] = [];

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
          stringBuilder.push(resolvedValue);
        }
      } else {
        stringBuilder.push(template[i]);
      }
    }
    if (stringBuilder.length === 1) {
      return stringBuilder[0];
    }
    return stringBuilder.join("");
  }

  /**
   * Execute expression
   * @param {string} expression
   * @param scope
   * @throws EvalError
   */
  private static evalExpression(expression: string, scope: any): any {
    let sandbox: any = {};
    Object.keys(scope).forEach(property => {
      if (property === "this" || property === "root" || property === "path" || property === "parent") {
        sandbox["_" + property] = scope[property];
      } else {
        sandbox[property] = scope[property];
      }
    });
    let vm = new VM({
      timeout: 100,
      sandbox: sandbox
    });
    try {
      return vm.run(expression);
    } catch (e) {
      throw new RenderError(new EvalError(e, expression), scope.path);
    }
  }

  /**
   * Evaluate For Expression
   * @param {string} expression
   * @param {ScopeModel} scope
   * @returns {ForExpression}
   */
  private static evalForExpression(expression: string, scope: ScopeModel): ForExpression {
    let parts = expression.split(" as ");
    if (parts.length !== 2) {
      throw new RenderError(new SyntaxError("Missing 'as'", expression,
        "loop expressions should be has the following syntax: 'items as item' or 'items as (item, i, l)'"), scope.path);
    }
    let itemsExpression = parts[0];
    let paramNames = parts[1].trim();

    // Eval items expression
    let items = TemplateEngine.evalExpression(itemsExpression, scope);
    if (!items || !Array.isArray(items)) {
      // return empty array if result is not an array
      return {
        items: []
      };
    }

    // Remove round brackets
    if (paramNames.indexOf("(") === 0 && paramNames.lastIndexOf(")") === paramNames.length - 1) {
      paramNames = paramNames.substr(1, paramNames.length - 2);
    }

    let result: ForExpression = {
      items: items
    };
    let params = paramNames.split(",");
    if (params.length > 0) {
      result.itemName = params[0].trim();
      if (params.length > 1) {
        result.indexName = params[1].trim();
        if (params.length > 2) {
          result.lengthName = params[2].trim();
        }
      }
    }
    return result;
  }

}

/**
 * For Expression parts
 */
interface ForExpression {
  items: any[];
  itemName?: string;
  indexName?: string;
  lengthName?: string;
}