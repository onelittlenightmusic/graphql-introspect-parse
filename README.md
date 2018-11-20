# graphql-introspect-parse
Parser for GraphQL Introspection Schema (JSON)

# Installation

```
npm install graphql-introspect-parse --save
```

# Usage

```typescript
import { getSchemaJson, GqlType } from 'graphql-introspect-parse';
var schema: GraphQLSchema = *** // comes from makeExecutableSchema and so on
var json = getSchemaJson(schema)
var query = json.getQuery('users')
console.log('users query returns List?: '+query.getReturnType().isList()) // returns true or false
```

## Reference

|Function|Description|
|---|---|
|`getSchemaJson(GraphQLSchema): GqlSchema`|Returns JSON format introspection schema|
|`GqlSchema.getType(name:string): GqlType`|Returns type information|
|`GqlType.isList()`|Returns if the type is LIST|
|`GqlSchema.getQuery(name: string): GqlField`|Returns query information|
|`GqlField.getReturnType(): GqlType`|Returns query return type|