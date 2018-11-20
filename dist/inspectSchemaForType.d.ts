import { GraphQLSchema } from "graphql";
export interface GqlField {
    name: string;
    description: string;
    type: GqlType;
    getReturnType(): GqlType;
    getName(): string;
    getDescription(): string;
}
export interface GqlType {
    kind: string;
    name: string;
    ofType: GqlType;
    getInnerType(): GqlType;
    isList(): boolean;
    getName(): string;
}
export interface GqlSchema {
    types: GqlType[];
    getType(name: string): GqlType;
    getQuery(name: string): GqlField;
}
export declare function getSchemaJson(schema: GraphQLSchema): GqlSchema;
