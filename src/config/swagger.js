const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expiry Date Manager API',
            version: '1.0.0',
            description: 'REST API documentation for the Expiry Date Manager application',
        },
        servers: [
            {
                url: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwtToken',
                },
            },
        },
    },
    apis: ['./src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
