import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Projeto Interdisciplinar",
      version: "1.0.0",
      description:
        "API REST para gerenciamento de materiais, produtos, simulações e histórico.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      schemas: {
        Material: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
            nome: { type: "string", example: "Aço" },
            quantidade: { type: "number", example: 100 },
          },
        },
        CreateMaterial: {
          type: "object",
          required: ["nome", "quantidade"],
          properties: {
            nome: { type: "string", example: "Aço" },
            quantidade: { type: "number", minimum: 0, example: 100 },
          },
        },
        UpdateMaterial: {
          type: "object",
          properties: {
            nome: { type: "string", example: "Aço Inox" },
            quantidade: { type: "number", minimum: 0, example: 200 },
          },
        },
        MaterialRef: {
          type: "object",
          required: ["materialId", "quantidade"],
          properties: {
            materialId: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
            quantidade: { type: "number", minimum: 1, example: 5 },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e2" },
            nome: { type: "string", example: "Parafuso" },
            quantidade: { type: "number", example: 50 },
            materiais: {
              type: "array",
              items: { $ref: "#/components/schemas/MaterialRef" },
            },
          },
        },
        CreateProduct: {
          type: "object",
          required: ["nome", "quantidade", "materiais"],
          properties: {
            nome: { type: "string", example: "Parafuso" },
            quantidade: { type: "number", minimum: 1, example: 50 },
            materiais: {
              type: "array",
              items: { $ref: "#/components/schemas/MaterialRef" },
            },
          },
        },
        UpdateProduct: {
          type: "object",
          properties: {
            nome: { type: "string", example: "Parafuso M6" },
            quantidade: { type: "number", minimum: 1, example: 80 },
            materiais: {
              type: "array",
              items: { $ref: "#/components/schemas/MaterialRef" },
            },
          },
        },
        SimulationRequest: {
          type: "object",
          required: ["productId", "quantidade"],
          properties: {
            productId: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e2" },
            quantidade: { type: "number", minimum: 1, example: 10 },
          },
        },
        SimulationResult: {
          type: "object",
          properties: {
            possivel: { type: "boolean", example: true },
            mensagem: { type: "string", example: "Produção possível" },
            materiaisNecessarios: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  materialId: { type: "string" },
                  nome: { type: "string" },
                  necessario: { type: "number" },
                  disponivel: { type: "number" },
                },
              },
            },
          },
        },
        History: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e3" },
            action: { type: "string", example: "CREATE" },
            entity: { type: "string", example: "Material" },
            description: { type: "string", example: "Material Aço criado" },
          },
        },
        CreateHistory: {
          type: "object",
          required: ["action", "entity", "description"],
          properties: {
            action: { type: "string", example: "CREATE" },
            entity: { type: "string", example: "Material" },
            description: { type: "string", example: "Material Aço criado" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Mensagem de erro" },
          },
        },
      },
    },
    paths: {
      "/materials": {
        get: {
          tags: ["Materiais"],
          summary: "Listar todos os materiais",
          responses: {
            "200": {
              description: "Lista de materiais",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Material" },
                  },
                },
              },
            },
            "500": {
              description: "Erro interno",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Materiais"],
          summary: "Criar um novo material",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateMaterial" },
              },
            },
          },
          responses: {
            "201": {
              description: "Material criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Material" },
                },
              },
            },
            "400": {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/materials/{id}": {
        get: {
          tags: ["Materiais"],
          summary: "Buscar material por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "64a1b2c3d4e5f6a7b8c9d0e1",
            },
          ],
          responses: {
            "200": {
              description: "Material encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Material" },
                },
              },
            },
            "400": { description: "ID inválido" },
            "404": { description: "Material não encontrado" },
          },
        },
        put: {
          tags: ["Materiais"],
          summary: "Atualizar material",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateMaterial" },
              },
            },
          },
          responses: {
            "200": {
              description: "Material atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Material" },
                },
              },
            },
            "400": { description: "Dados ou ID inválido" },
          },
        },
        delete: {
          tags: ["Materiais"],
          summary: "Deletar material",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Material deletado" },
            "400": { description: "ID inválido" },
            "404": { description: "Material não encontrado" },
          },
        },
      },
      "/products": {
        get: {
          tags: ["Produtos"],
          summary: "Listar todos os produtos",
          responses: {
            "200": {
              description: "Lista de produtos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Produtos"],
          summary: "Criar um novo produto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProduct" },
              },
            },
          },
          responses: {
            "201": {
              description: "Produto criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            "400": { description: "Dados inválidos" },
          },
        },
      },
      "/products/{id}": {
        get: {
          tags: ["Produtos"],
          summary: "Buscar produto por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Produto encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            "400": { description: "ID inválido" },
            "404": { description: "Produto não encontrado" },
          },
        },
        put: {
          tags: ["Produtos"],
          summary: "Atualizar produto",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProduct" },
              },
            },
          },
          responses: {
            "200": { description: "Produto atualizado" },
            "400": { description: "Dados ou ID inválido" },
          },
        },
        delete: {
          tags: ["Produtos"],
          summary: "Deletar produto",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Produto deletado" },
            "400": { description: "ID inválido" },
            "404": { description: "Produto não encontrado" },
          },
        },
      },
      "/simulate": {
        post: {
          tags: ["Simulação"],
          summary: "Simular produção de um produto",
          description:
            "Verifica se há materiais suficientes para produzir uma quantidade de um produto.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SimulationRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Resultado da simulação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SimulationResult" },
                },
              },
            },
            "400": { description: "Dados inválidos" },
          },
        },
      },
      "/history": {
        get: {
          tags: ["Histórico"],
          summary: "Listar todo o histórico",
          responses: {
            "200": {
              description: "Lista de registros do histórico",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/History" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Histórico"],
          summary: "Criar registro no histórico",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateHistory" },
              },
            },
          },
          responses: {
            "201": { description: "Registro criado" },
            "400": { description: "Dados inválidos" },
          },
        },
      },
      "/history/{id}": {
        get: {
          tags: ["Histórico"],
          summary: "Buscar registro do histórico por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Registro encontrado" },
            "404": { description: "Registro não encontrado" },
          },
        },
        delete: {
          tags: ["Histórico"],
          summary: "Deletar registro do histórico",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Registro deletado" },
            "404": { description: "Registro não encontrado" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);