import { TemplateEngine } from "./template-engine";
import { assert } from "chai";

describe("TemplateEngine", () => {

  describe("basic", () => {

    it("render flat object", () => {
      let template: any = {
        name: "first template",
        age: 69,
        male: true
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        name: "first template",
        age: 69,
        male: true
      });
    });

    it("render nested object", () => {
      let template: any = {
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

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
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

    it("render string variable", () => {
      let template: any = {
        firstName: "John",
        lastName: "Jackson",
        name: "${_this.firstName} ${_this.lastName}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        firstName: "John",
        lastName: "Jackson",
        name: "John Jackson"
      });
    });

  });

  describe("expression", () => {

    it("render unknown string variable", () => {
      let template: any = {
        name: "${_this.firstName}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        name: ""
      });
    });

    it("render syntax error", () => {
      let template: any = {
        name: "${unknown_property}"
      };

      assert.throw(() => {
        TemplateEngine.render(template);
      }, "unknown_property is not defined in expression 'unknown_property' at 'name'");
    });

    it("render labda expression", () => {
      let template: any = {
        name: "${[5,6].map(value => \"a-\" + value).join(',')}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        name: "a-5,a-6"
      });
    });

  });

  describe("~~~if", () => {

    it("render ~~~if true then this", () => {
      let template: any = {
        '~~~if': "_this.type === 'Awesome'",
        type: "Awesome"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        type: "Awesome"
      });
    });

    it("render ~~~if false then nothing", () => {
      let template: any = {
        '~~~if': "_this.type !== 'Awesome'",
        type: "Awesome"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {});
    });

    it("render ~~~if true then ~~~then object", () => {
      let template: any = {
        '~~~if': "_this.type === 'Awesome'",
        '~~~then': {
          say: "Cool..."
        },
        type: "Awesome"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        type: "Awesome",
        say: "Cool..."
      });
    });

    it("render ~~~if false then ~~~else object", () => {
      let template: any = {
        '~~~if': "_this.type !== 'Awesome'",
        '~~~then': {
          say: "Cool..."
        },
        '~~~else': {
          say: "Not Cool..."
        },
        type: "Awesome"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        type: "Awesome",
        say: "Not Cool..."
      });
    });

    it("render ~~~if overwrite object", () => {
      let template: any = {
        '~~~if': "_this.type === 'Awesome'",
        '~~~then': "Cool",
        type: "Awesome"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, "Cool");
    });

    it("render ~~~if remove object", () => {
      let template: any = {
        prop1: {
          '~~~if': "_this.type === 'Awesome'",
          '~~~then': undefined,
          type: "Awesome"
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {});
    });
  });

  describe("scope", () => {

    it("render correct scope of root object", () => {
      let template: any = {
        "level": "root",
        "computed_level": "${_root.level}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        "level": "root",
        "computed_level": "root"
      });
    });

    it("render correct scope of this object", () => {
      let template: any = {
        "level": "this",
        "computed_level": "${_this.level}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        "level": "this",
        "computed_level": "this"
      });
    });

    it("render correct scope of nested root object", () => {
      let template: any = {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "computed_level": "${_root.level}"
          }
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "computed_level": "root"
          }
        }
      });
    });

    it("render correct scope of nested this object in statement", () => {
      let template: any = {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "level": "this",
            "~~~if": "true",
            "~~~then": {
              "computed_level": "${_this.level}"
            }
          }
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "level": "this",
            "computed_level": "this"
          }
        }
      });
    });

    it("render correct scope of nested this object", () => {
      let template: any = {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "level": "this",
            "computed_level": "${_this.level}"
          }
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        "level": "root",
        "sub_object": {
          "sub_sub_object": {
            "level": "this",
            "computed_level": "this"
          }
        }
      });
    });
  });

  describe("~~~foreach", () => {

    it("render ~~~for loop", () => {
      let template: any = {
        names: ["Bob", "Alise"],
        result: {
          "~~~for": "_root.names as name",
          name: "${name}"
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        names: ["Bob", "Alise"],
        result: [
          {
            name: "Bob"
          }, {
            name: "Alise"
          }]
      });
    });

    it("render ~~~for ~~~each loop", () => {
      let template: any = {
        items: [1, 2, 3, 4, 5],
        "~~~for": "_this.items as (item, i, l)",
        "~~~each": "${item + 1}"
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, [2, 3, 4, 5, 6]);
    });

    it("render ~~~for ~~~each loop params", () => {
      let template: any = {
        names: ["Bob", "Alise"],
        results: {
          "~~~for": "_root.names as (name, i, l)",
          "~~~each": {
            name: "${name}",
            index: "${i}",
            length: "${l}"
          }
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        names: ["Bob", "Alise"],
        results: [
          {
            name: "Bob",
            index: 0,
            length: 2
          },
          {
            name: "Alise",
            index: 1,
            length: 2
          }
        ]
      });
    });

    it("render ~~~for ${key}", () => {
      let template: any = {
        names: ["Bob", "Alise"],
        results: {
          "~~~for": "_root.names as (name, i, l)",
          '${name}': "${i} item"
        }
      };

      let result = TemplateEngine.render(template);
      assert.deepEqual(result, {
        names: ["Bob", "Alise"],
        results: {
          "Bob": "0 item",
          "Alise": "1 item"
        }
      });
    });

  });


});