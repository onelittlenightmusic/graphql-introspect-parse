"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var GqlFieldImpl = (function () {
    function GqlFieldImpl(gqlField) {
        Object.assign(this, gqlField);
    }
    GqlFieldImpl.prototype.getReturnType = function () {
        return new GqlTypeImpl(this.type);
    };
    GqlFieldImpl.prototype.getName = function () {
        return this.name;
    };
    GqlFieldImpl.prototype.getDescription = function () {
        return this.description;
    };
    return GqlFieldImpl;
}());
var GqlTypeImpl = (function () {
    function GqlTypeImpl(gqlType) {
        Object.assign(this, gqlType);
    }
    GqlTypeImpl.prototype.getInnerType = function () {
        return new GqlTypeImpl(this.ofType);
    };
    GqlTypeImpl.prototype.isList = function () {
        return this.kind === 'LIST';
    };
    GqlTypeImpl.prototype.getName = function () {
        return this.name;
    };
    return GqlTypeImpl;
}());
var GqlSchemaImpl = (function () {
    function GqlSchemaImpl(types) {
        this.types = types;
    }
    GqlSchemaImpl.prototype.getType = function (name) {
        return new GqlTypeImpl(findType(this.types, name));
    };
    GqlSchemaImpl.prototype.getQuery = function (name) {
        return new GqlFieldImpl(findField(this.types, name));
    };
    return GqlSchemaImpl;
}());
function getSchemaJson(schema) {
    var json = graphql_1.graphqlSync(schema, graphql_1.introspectionQuery).data;
    if (json != null && ("__schema" in json)) {
        var schema_1 = json["__schema"];
        if ("types" in schema_1) {
            return new GqlSchemaImpl(schema_1["types"]);
        }
    }
    return new GqlSchemaImpl([]);
}
exports.getSchemaJson = getSchemaJson;
function findType(jsonSchemaArray, typeName) {
    if (jsonSchemaArray != null) {
        return jsonSchemaArray.find(function (a) { return a.name === typeName; });
    }
    return null;
}
function findField(jsonschema, fieldName) {
    if (jsonschema != null) {
        return findType(jsonschema, "Query")["fields"].find(function (a) { return a.name === fieldName; });
    }
    return null;
}
//# sourceMappingURL=inspectSchemaForType.js.map