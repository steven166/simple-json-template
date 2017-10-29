var TemplateEngine = require("../dist/template-engine");

// Simple Json Template
var dockerComposeTemplate = {
  version: '3',
  services: {
    "~~~for": "services as service, i",
    "${service.name}": {
      image: "myrepo/${service.name}:${service.version}",
      build: {
        context: "${service.name}",
        dockerfile: "${service.name}/Dockerfile"
      },
      ports: {
        "~~~for": "service.ports as (containerPort, j)",
        "~~~each": "${9000 + j + (i * 10)}:${containerPort}"
      },
      environment: {
        "~~~for": "service.envs as env",
        "${env.name}": "${env.value}"
      }
    }
  }
};

// Data used to render this template
var data = {
  services: [
    {
      name: "order-service",
      version: "1.0",
      ports: [ 8080 ],
      envs: [
        {
          name: "product_service_url",
          value: "http://product-service:8080"
        }
      ]
    },
    {
      name: "product-service",
      version: "3.5",
      ports: [ 8080, 9001 ],
      envs: [
        {
          name: "database_host",
          value: "mysql.hosts"
        },
        {
          name: "database_name",
          value: "product-database"
        },
        {
          name: "database_username",
          value: "product-database"
        },
        {
          name: "database_password",
          value: "mypass123"
        }
      ]
    }
  ]
};

// Render template
var result = TemplateEngine.render(dockerComposeTemplate, data);

// Output result
console.info(JSON.stringify(result, undefined, 2));
