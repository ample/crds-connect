import { Attribute } from './attribute';

export class AttributeType {
    name: string;
    attributeTypeId: number;
    allowMultipleSelections: boolean;
    attributes: Attribute[];


    constructor($name: string, $attributeTypeId: number, $allowMultipleSelections: boolean, $attributes: Attribute[]) {
        this.name = $name;
        this.attributeTypeId = $attributeTypeId;
        this.allowMultipleSelections = $allowMultipleSelections;
        this.attributes = $attributes;
    }

}
