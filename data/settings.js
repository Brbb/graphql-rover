var settings = {
    "endpoints": [
        {
            "name": "Pokemon Endpoint",
            "url": "http://graph.pokeql.win/?",
            "auth": '',
            "verb": 'POST',
            "accept": '*/*',
            "contentType": 'application/graphql',
            "useIntrospectionQuery": true,
            "dataType": '',

        },
        {
            "name": "Local Test Endpoint",
            "url": "http://localhost:5000/graphql",
            "auth": 'Basic <token>',
            "verb": 'GET',
            "accept": 'application/json',
            "contentType": 'application/json',
            "useIntrospectionQuery": false,
            "dataType": 'text',

        }
    ]
}