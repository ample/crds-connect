import { Attribute } from './attribute';

export class Category {
    categoryId: number;
    attribute: Attribute;
    desc: string;
    exampleText: string;
    requiresActiveAttribute: boolean;
    name: string;



    constructor(categoryId: number, attribute: Attribute, desc: string, exampleText: string,
                requiresActiveAttribute: boolean, name: string) {
                    this.categoryId = categoryId;
                    this.attribute = attribute;
                    this.desc = desc;
                    this.exampleText = exampleText;
                    this.requiresActiveAttribute = requiresActiveAttribute;
                    this.name = name;

    }
}
