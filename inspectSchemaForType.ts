import { graphqlSync, introspectionQuery, GraphQLSchema } from "graphql";

export interface GqlField {
    name: string
    description: string
    type: GqlType
    getReturnType(): GqlType
    getName(): string
    getDescription(): string
}

export interface GqlType {
    kind: string
    name: string
    ofType: GqlType
    getInnerType(): GqlType
    isList(): boolean
    getName(): string
}

export interface GqlSchema {
    types: GqlType[]
    getType(name: string): GqlType
    getQuery(name: string): GqlField
}

class GqlFieldImpl implements GqlField {
    name: string
    description: string
    type: GqlType
    constructor(gqlField: GqlField) {
        Object.assign(this, gqlField)
    }
    getReturnType(): GqlType {
        return new GqlTypeImpl(this.type)
    }
    getName(): string {
        return this.name
    }
    getDescription(): string {
        return this.description
    }
}

class GqlTypeImpl implements GqlType {
    kind: string
    name: string
    ofType: GqlType
    constructor(gqlType: GqlType) {
        Object.assign(this, gqlType)
    }
    getInnerType(): GqlType {
        return new GqlTypeImpl(this.ofType)
    }
    isList(): boolean {
        return this.kind === 'LIST'
    }
    getName(): string {
        return this.name
    }
}

class GqlSchemaImpl implements GqlSchema {
    types: GqlType[]
    constructor(types: GqlType[]) {
        this.types = types
    }
    getType(name: string): GqlType {
        return new GqlTypeImpl(findType(this.types, name))
    }
    getQuery(name: string): GqlField {
        return new GqlFieldImpl(findField(this.types, name))
    }
}

export function getSchemaJson(schema: GraphQLSchema): GqlSchema {
    var json = graphqlSync(schema, introspectionQuery).data
    if(json != null && ("__schema" in json)) {
        let schema = json["__schema"]
        if("types" in schema) {
            return new GqlSchemaImpl(schema["types"])
        }
    }
    return new GqlSchemaImpl([])
}

function findType(jsonSchemaArray: any, typeName: string): any {
    if(jsonSchemaArray != null) {
        return jsonSchemaArray.find(a => a.name === typeName)
    }
    return null
}

function findField(jsonschema: any, fieldName: string): any {
    if(jsonschema != null) {
        return findType(jsonschema, "Query")["fields"].find(a => a.name === fieldName)
    }
    return null
}