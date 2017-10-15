import { ScopeModel } from "./models/scope.model";
export declare class TemplateEngine {
    static render(template: any, context?: object): any;
    static renderAny(template: any, context: object, scope: ScopeModel): any;
    private static renderArray(template, context, scope);
    private static renderObject(template, context, scope);
    private static renderString(template, context, scope);
    private static evalExpression(expression, scope);
}
