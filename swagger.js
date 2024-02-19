const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger_output.json'
const endpointsFiles = ['./apiRoutes.js']


const doc = {
    info: {
        version: "1.0.0",
        title: "HUB NEWS",
        description: "Documentação da API."
    },
    host: "localhost:8001",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Analytic",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        WordsFrequency: {
            mostFrequentWordsInContent: [
                {
                    word: "governo",
                    frequency: 760
                },
                {
                    word: "brasil",
                    frequency: 738
                },
                {
                    word: "ensino",
                    frequency: 732
                }
            ]
        },
        WordsCharts: {
            labels: [
                "3-3-2021",
                "9-11-2021",
                "7-2-2022",
            ],
            data: [
                1,
                1,
                1,
        
            ]
        },
        NewsKeyword: {
            news: [
                {
                    date: " 06/10/2022 às 16:03 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/08/FTA20220905046-e1664892465983.jpg?w=347",
                    title: "Boris Casoy: Pesquisando as pesquisas",
                    url: "https://www.cnnbrasil.com.br/politica/boris-casoy-pesquisando-as-pesquisas/"
                },
                {
                    date: " 23/09/2022 às 08:42 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/05/Copia-de-16x9-Podcast-WW.png?w=347",
                    title: "As pesquisas eleitorais são confiáveis?",
                    url: "https://www.cnnbrasil.com.br/politica/as-pesquisas-eleitorais-sao-confiaveis/"
                }
            ]
        }
        
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js')
})