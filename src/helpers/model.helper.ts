/**
 * Model helper
 */
export class ModelHelper {

  /**
   * Merge value 2 and value1, where value 2 is the leading one
   * @param value1
   * @param value2
   * @returns {any}
   */
  public static merge(value1: any, value2: any): any {
    if(value2 === null || value2 === undefined){
      return value2;
    }else if(value1 === null || value1 === undefined){
      return value2;
    }

    if (Array.isArray(value2)) {
      if (Array.isArray(value1)) {
        return ModelHelper.mergeArrays(value1, value2);
      } else {
        return ModelHelper.mergeArrays([], value2);
      }
    } else if (typeof(value2) === "object") {
      if (typeof(value1) === "object") {
        return ModelHelper.mergeObjects(value1, value2);
      } else {
        return ModelHelper.mergeObjects({}, value2);
      }
    } else {
      return value2;
    }
  }

  /**
   * Merge value 2 and value1, where value 2 is the leading one
   * @param {any[]} value1
   * @param {any[]} value2
   * @returns {any[]}
   */
  public static mergeArrays(value1: any[], value2: any[]): any[] {
    let result: any[] = [];
    value1.forEach(item => {
      result.push(item);
    });
    value2.forEach(item => {
      if (result.indexOf(item) === -1) {
        result.push(item);
      }
    });
    return result;
  }

  /**
   * Merge value 2 and value1, where value 2 is the leading one
   * @param {any} value1
   * @param {any} value2
   * @returns {any}
   */
  public static mergeObjects(value1: any, value2: any): any {
    let result: any = {};

    let properties = ModelHelper.mergeArrays(Object.keys(value1), Object.keys(value2));
    properties.forEach(property => {
      if (value2.hasOwnProperty(property)) {
        if (value1.hasOwnProperty(property)) {
          result[property] = ModelHelper.merge(value1[property], value2[property]);
        } else {
          result[property] = value2[property];
        }
      } else if (value1.hasOwnProperty(property)) {
        result[property] = value1[property];
      }
    });

    return result;
  }

}