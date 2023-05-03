# OpenAPI Path Retriever
Typescript package that enables to retrieve the endpoint path of an OpenApi specification from the url of an http request. For 3.1.x and 3.0.x OpenAPI versions.

## Installation
```typescript
npm install openapi-path-retriever 
```
or
```typescript
yarn add openapi-path-retriever
```

## Usage
```typescript
import { specBuilder, pathRetriever } from 'openapi-path-retriever'

const main = async () => {

    /* First, by specBuilder, get, check and parse the openapi specification that can be an object or an file path string.
     * If the specification input is a file path string, a second argument standing for the current working directory is mandatory.
     * We recommend to use '__dirname' as second argument.
     * The file must be either a json, a yaml or a yml file. 
     * specBuilder returns an object in accordance with OpenAPI scpecification.
    */
    const schema = await specBuilder('./openapi.yaml', __dirname)

    // Setup url input
    const url = 'https://balanceplatform-api-test.adyen.com/btl/v3/transactions/dhdjduffjjfj'

    /* From the got-above schema and the url, retrieve the endpoint path that matches in the schema. 
     * You will either a string (if there is an endpoint path) or null (if there is no).
    */
    const path = pathRetriever(schema, url)
}

main()
```

## License
This package is licensed under the [MIT License](https://opensource.org/licenses/mit).

## Contact
If you have any questions or issues, please contact the package maintainer at ekoulemaneng@gmail.com.
