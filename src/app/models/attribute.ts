export class Attribute {
    attributeId: number;
    name: string;
    description: string;
    category: string;
    categoryId: number;
    categoryDescription: string;
    sortOrder: number;
    attributeTypeId: number;
    startDate: Date;
    endDate: Date;
    selected: boolean = false;

    public static constructor_create_group(): Attribute {
       return new Attribute(0, '', '', '', 0, '', 0, 0, null, null);
    }

    constructor(attributeId: number, name: string, description: string, category: string, categoryId: number,
                categoryDescription: string, sortOrder: number, attributeTypeId: number, endDate: Date, startDate: Date) {
                    this.attributeId = attributeId;
                    this.name = name;
                    this.category = category;
                    this.categoryId = categoryId;
                    this.categoryDescription = categoryDescription;
                    this.sortOrder = sortOrder;
                    this.attributeTypeId = attributeTypeId;
                    this.endDate = endDate;
                    this.startDate  = startDate;
    }
}
