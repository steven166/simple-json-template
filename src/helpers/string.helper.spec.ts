import { assert } from "chai";
import { StringHelper } from "./string.helper";

describe("StringHelper", () => {

  describe("readUntil", () => {

    it("Read Until end", () => {
      // Arrange
      let string = "hello!";

      // Act
      let index = StringHelper.readUntil(string, "!");

      // Assert
      assert.deepEqual(index, {
        text: "hello",
        length: 5
      });
    });

    it("Read Until middle", () => {
      // Arrange
      let string = "hello! By!";

      // Act
      let index = StringHelper.readUntil(string, "!");

      // Assert
      assert.deepEqual(index, {
        text: "hello",
        length: 5
      });
    });

    it("Read Until unkown", () => {
      let string = "hello";

      assert.throw(() => {
        StringHelper.readUntil(string, "!");
      }, "Missing '!' after 'hello'");
    });

    it("Read nested brackets", () => {
      let string = "`${[5,6].map(value => \"a-\" + value).join(',')\\}`}";

      // Act
      let index = StringHelper.readUntil(string, "}");

      // Assert
      assert.deepEqual(index, {
        text: "`${[5,6].map(value => \"a-\" + value).join(',')}`",
        length: string.length -1
      });
    });

  });

});