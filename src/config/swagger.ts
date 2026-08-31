import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RiwiMediCare Plus API",
            version: "1.0.0",
            description: "API para la gestion de solicitudes de abastecimiento de medicamentos entre clinicas y almacenes. Desarrollada con Express, TypeScript, Sequelize y PostgreSQL. Autenticacion con JWT. Para usar los endpoints protegidos: ejecuta POST /api/auth/login, copia el token y pegalo en el boton Authorize (solo el token, sin escribir Bearer)."
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Token JWT obtenido en POST /api/auth/login"
                }
            },
            schemas: {
                RegisterUser: {
                    type: "object",
                    required: ["name", "email", "password", "role"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nestor Duran"
                        },
                        email: {
                            type: "string",
                            example: "admin@medicare.com"
                        },
                        password: {
                            type: "string",
                            example: "Admin123"
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "manager"],
                            example: "admin"
                        }
                    }
                },
                Login: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "admin@medicare.com"
                        },
                        password: {
                            type: "string",
                            example: "Admin123"
                        }
                    }
                },
                Clinic: {
                    type: "object",
                    required: ["name", "nit", "address", "city_id", "manager_id"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Clinica del Caribe"
                        },
                        nit: {
                            type: "string",
                            example: "890102345-1"
                        },
                        address: {
                            type: "string",
                            example: "Calle 80 # 49-40"
                        },
                        city_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-1111-4111-8111-111111111111"
                        },
                        manager_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-2222-4222-8222-222222222222"
                        }
                    }
                },
                Medication: {
                    type: "object",
                    required: ["name", "presentation"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Acetaminofen"
                        },
                        presentation: {
                            type: "string",
                            example: "Tableta 500mg"
                        }
                    }
                },
                Warehouse: {
                    type: "object",
                    required: ["name", "address", "city_id"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Almacen Central Norte"
                        },
                        address: {
                            type: "string",
                            example: "Calle 84 # 45-12"
                        },
                        city_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-1111-4111-8111-111111111111"
                        }
                    }
                },
                CreateRequest: {
                    type: "object",
                    required: ["clinic_id", "medication_id", "warehouse_id", "quantity"],
                    properties: {
                        clinic_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-3333-4333-8333-333333333333"
                        },
                        medication_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-4444-4444-8444-444444444444"
                        },
                        warehouse_id: {
                            type: "string",
                            format: "uuid",
                            example: "a3f2b1c4-5555-4555-8555-555555555555"
                        },
                        quantity: {
                            type: "integer",
                            example: 10
                        }
                    }
                },
                UpdateRequestStatus: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["pendiente", "aprobada", "rechazada", "entregada"],
                            example: "aprobada"
                        }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Mensaje de error"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
}

export const swaggerSpec = swaggerJSDoc(options)
