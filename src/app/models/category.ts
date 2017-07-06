import { Attribute } from './attribute';

export class Category {
    categoryId: number;
    attribute: Attribute;
    desc: string;
    exampleText: string;
    requiresActiveAttribute: boolean;
    name: string;
    selected: boolean = false;
    categoryDetail: string;



    constructor(categoryId: number, attribute: Attribute, desc: string, exampleText: string,
                requiresActiveAttribute: boolean, name: string, categoryDetail: string = '') {
                    this.categoryId = categoryId;
                    this.attribute = attribute;
                    this.desc = desc;
                    this.exampleText = exampleText;
                    this.requiresActiveAttribute = requiresActiveAttribute;
                    this.name = name;
                    this.categoryDetail = categoryDetail;

    }
}
