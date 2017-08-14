var settings = {
    "endpoints": [
        {
            "name": "GraphQL Conference",
            "url": "https://graphql-europe.org/graphql",
            "auth": '',
            "verb": 'POST',
            "accept": '*/*',
            "contentType": 'application/json',
            "useIntrospectionQuery": true,
            "requestBodyType": 'application/json',

        },
        {
            "name": "Pokemon Endpoint",
            "url": "http://graph.pokeql.win/?",
            "auth": '',
            "verb": 'POST',
            "accept": '*/*',
            "contentType": 'application/graphql',
            "useIntrospectionQuery": true,
            "requestBodyType": '',

        },
        {
            "name": "Local Test Endpoint",
            "url": "http://localhost:5000/graphql",
            "auth": 'Basic <token>',
            "verb": 'GET',
            "accept": 'application/json',
            "contentType": 'application/json',
            "useIntrospectionQuery": false,
            "requestBodyType": 'text',

        }
    ]
}