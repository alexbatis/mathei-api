import { JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class IdConverter implements JsonCustomConvert<Number> {
    serialize(id: Number): any {
        return id.toString();
    }
    deserialize(id: any): Number {
        return parseInt(id);
    }
}