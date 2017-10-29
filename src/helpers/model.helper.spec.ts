import { assert } from "chai";
import { ModelHelper } from "./model.helper";

describe("ModelHelper", () => {

  describe("merge", () => {

    it("Merge strings", () => {
      let value1 = "value1";
      let value2 = "value2";

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, value2);
    });

    it("Merge target null", () => {
      let value1 = "value1";
      let value2 = null;

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, null);
    });

    it("Merge target undefined", () => {
      let value1 = "value1";
      let value2 = undefined;

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, undefined);
    });

    it("Merge source null", () => {
      let value1 = null;
      let value2 = "value2";

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, value2);
    });

    it("Merge source undefined", () => {
      let value1 = undefined;
      let value2 = "value2";

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, value2);
    });

    it("Merge source undefined", () => {
      let value1 = undefined;
      let value2 = "value2";

      let merged = ModelHelper.merge(value1, value2);

      assert.equal(merged, value2);
    });

    it("Merge array", () => {
      let value1 = [1,2,3];
      let value2 = [3,4,5];

      let merged = ModelHelper.merge(value1, value2);

      assert.deepEqual(merged, [1,2,3,4,5]);
    });

    it("Merge object", () => {
      let value1 = {
        prop1: "val1",
        prop2: "val2"
      };
      let value2 = {
        prop2: "overwrite2",
        prop3: "overwrite3"
      };

      let merged = ModelHelper.merge(value1, value2);

      assert.deepEqual(merged, {
        prop1: "val1",
        prop2: "overwrite2",
        prop3: "overwrite3"
      });
    });

    it("Merge nested object", () => {
      let value1 = {
        obj1: {
          prop1: "val1"
        },
        prop2: "val2"
      };
      let value2 = {
        obj1: {
          prop1: "overwrite1"
        },
        obj2: {
          prop2: "overwrite2"
        },
        prop3: "overwrite3"
      };

      let merged = ModelHelper.merge(value1, value2);

      assert.deepEqual(merged, {
        obj1: {
          prop1: "overwrite1"
        },
        prop2: "val2",
        obj2: {
          prop2: "overwrite2"
        },
        prop3: "overwrite3"
      });
    });

  });

});