# simple-json-template
[![Build Status](https://travis-ci.org/steven166/simple-json-template.svg?branch=master)](https://travis-ci.org/steven166/simple-json-template)
[![Coverage](https://img.shields.io/codecov/c/github/codecov/example-python/master.svg)](https://codecov.io/gh/steven166/simple-json-template)
A Simple JSON template engine to render JSON structured data

## Example
**docker-compose Template** (yaml)
```yaml
version: '3',
services: 
  '~~~for': 'services as service, i'
  '${service.name}':
    image: 'myrepo/${service.name}:${service.version}'
    build:
      context: '${service.name}'
      dockerfile: '${service.name}/Dockerfile'
    ports:
      '~~~for': 'service.ports as (containerPort, j)'
      '~~~each': '${9000 + j + (i * 10)}:${containerPort}'
    'environment':
      '~~~for': 'service.envs as env'
      '${env.name}': '${env.value}'
```
**Data** (json)
```json
{
  "services": [
    {
      "name": "order-service",
      "version": "1.0",
      "ports": [ 8080 ],
      "envs": [
        {
          "name": "product_service_url",
          "value": "http://product-service:8080"
        }
      ]
    },
    {
      "name": "product-service",
      "version": "3.5",
      "ports": [ 8080, 9001 ],
      "envs": [
        {
          "name": "database_host",
          "value": "mysql.hosts"
        },
        {
          "name": "database_name",
          "value": "product-database"
        },
        {
          "name": "database_username",
          "value": "product-database"
        },
        {
          "name": "database_password",
          "value": "mypass123"
        }
      ]
    }
  ]
}
```
**Output** (yaml)
```yaml
version: '3',
services: 
  order-service:
    image: 'myrepo/order-service:1.0'
    build:
      context: .
      dockerfile: 'order-service/Dockerfile'
    ports:
      - '9000:8080'
    environment:
      product_service_url: 'http://product-service:8080'
  product-service:
    image: 'myrepo/product-service:3.5'
    build:
      context: .
      dockerfile: 'product-service/Dockerfile'
    ports:
      - '9010:8080'
      - '9011:9001'
    environment:
      database_host: 'mysql.hosts'
      database_name: 'product-database'
      database_username: 'product-database'
      database_password: 'mypass123'
     
```

## Install
```bash
npm install simple-json-template
```
## Usage
```js
var TemplateEngine = require("simple-json-template");

var result = TemplateEngine.render({
  say: "${message}"
}, {
  message: "Hello!"
});
```
## Syntax
A Simple JSON Template is basically an object structure which describes how it should be rendered based on input data. 
The template can be defined in JSON, Yaml or in Javascript itself. 

### Expressions
Expressions are a string of JavaScript code to get data or manipulate it. For example: `${myList.length}`. Or a more complicated expression: `${myList.filter(item => !item.hidden).map(item => item.name).join(', ')}`.
The JavaScript code is executed in a sandbox provided by [vm2](https://github.com/patriksimek/vm2)

### Variables
You can use variables inside an expression. These variables can be provided when rendering the template:
```js
var result = TemplateEngine.render({
  say: "${message}"
}, {
  message: "Hello!"
});
// 'say' renders as "Hello!"
```
Variables can also be found in the template itself:
```js
var result = TemplateEngine.render({
  message: "Hello",
  output: {
    name: "Bill!",
    say: "${_root.message} ${_this.name}"
  }
});
// 'output.say' renders as "Hello Bill!"
```
The variable `_this` returns the current object where the expression is and the `_root` variable returns the root object of the template.

### ~~~if Statement
The **if statement** can be used to show parts of template based on a condition. 

**Example 1: if statement is true**
```js
var result = TemplateEngine.render({
  user: {
    name: "Bob"  
  },
  '~~~if': "_this.user.toLowerCase() === 'bob'"
});
// renders as:
// {
//   user: {
//     name: "Bob",
//   }
// }
```

**Example 2: if statement is false**
```js
var result = TemplateEngine.render({
  user: {
    name: "John"  
  },
  '~~~if': "_this.user.toLowerCase() === 'bob'"
});
// renders as:
// {}
```

**Example 3: if statement with then**
```js
var result = TemplateEngine.render({
  user: {
    name: "Bob"  
  },
  '~~~if': "_this.user.toLowerCase() === 'bob'",
  '~~~then': {
    user: {
      name: "Bob Awesome!"
    }
  }
});
// renders as:
// {
//   user: {
//     name: "Bob Awesome!",
//   }
// }
```

**Example 4: if statement with else**
```js
var result = TemplateEngine.render({
  user: {
    name: "John"  
  },
  '~~~if': "_this.user.toLowerCase() === 'bob'",
  '~~~else': {
    user: {
      name: "Not Bob"
    }
  }
});
// renders as:
// {
//   user: {
//     name: "Not Bob",
//   }
// }
```

### ~~~for Statement
The **for statement** can be used for looping over a list.

**Example 1: loop over list**
```js
var result = TemplateEngine.render({
  user: {
    '~~~for': "users as user",
    name: "${user}"
  }
}, {
  users: ["Bob", "Alise"]
});
// renders as:
// {
//   users: [
//     {
//       name: "Bob",
//     },
//     {
//       name: "Alise",
//     }]
// }
```

**Example 2: use index and length**
```js
var result = TemplateEngine.render({
  user: {
    '~~~for': "users as (user, index, length)",
    id: "${index}/${length}",
    name: "${user}"
  }
}, {
  users: ["Bob", "Alise"]
});
// renders as:
// {
//   users: [
//     {
//       id: "0/2"
//       name: "Bob",
//     },
//     {
//       id: "1/2"
//       name: "Alise",
//     }]
// }
```

**Example 3: loop using each**
```js
var result = TemplateEngine.render({
  user: {
    '~~~for': "users as user",
    '~~~each': {
      name: "${user}"
    }
  }
}, {
  users: ["Bob", "Alise"]
});
// renders as:
// {
//   users: [
//     {
//       name: "Bob",
//     },
//     {
//       name: "Alise",
//     }]
// }
```

**Example 4: loop using property keys**
```js
var result = TemplateEngine.render({
  user: {
    '~~~for': "users as user, id",
    '${user}': {
      id: "${id}"
    }
  }
}, {
  users: ["Bob", "Alise"]
});
// renders as:
// {
//   users: {
//     Bob: {
//       id: "0"
//     },
//     Alise: {
//       id: "1",
//     }
//   }
// }
```

# Licence
MIT
