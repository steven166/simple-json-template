import { TemplateEngine } from "./template-engine";
import { assert } from "chai";

describe("TemplateEngine", () => {

  it("render flat object", () => {
    let template: any = {
      name: "first template",
      age: 69,
      male: true
    };

    let result  = TemplateEngine.render(template);
    assert.deepEqual(result, {
      name: "first template",
      age: 69,
      male: true
    });
  });

  it("render nexted object", () => {
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

    let result  = TemplateEngine.render(template);
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

    let result  = TemplateEngine.render(template);
    assert.deepEqual(result, {
      firstName: "John",
      lastName: "Jackson",
      name: "John Jackson"
    });
  });

  it("render unknown string variable", () => {
    let template: any = {
      name: "${_this.firstName}"
    };

    let result  = TemplateEngine.render(template);
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

    let result  = TemplateEngine.render(template);
    assert.deepEqual(result, {
      name: "a-5,a-6"
    });
  });

  it("render ~~~if true then this", () => {
    let template: any = {
      '~~~if': "name === 'Awesome'",
      type: "Awesome"
    };

    let result  = TemplateEngine.render(template);
    assert.deepEqual(result, {
      type: "Awesome"
    });
  });

});