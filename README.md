# simple-json-template
A Simple JSON template engine to render JSON structured data

## Example
**docker-compose Template**
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
**Data**
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
};
```
**Output**
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
```
npm install simple-json-template
```
## Usage
```
var TemplateEngine = require("simple-json-template");

var result = TemplateEngine.render({
  say: "${message}"
}, {
  message: "Hello!"
});
```
## Syntax

### Expressions
Expressions are a string of JavaScript code to get data or manipulate it. For example: `${myList.length}`. Or a more complicated expression: `${myList.filter(item => !item.hidden).map(item => item.name).join(', ')}`.
The JavaScript code is executed in a sandbox provided by [vm2](https://github.com/patriksimek/vm2)
