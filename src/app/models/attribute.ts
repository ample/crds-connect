export class Attribute {
    attributeId: number;
    name: string;
    description: string;
    category: string;
    categoryId: number;
    categoryDescription: string;
    sortOrder: number;
    endDate: Date;
    startDate: Date;

    constructor(attributeId: number, name: string, description: string, category: string, categoryId: number,
                categoryDescription: string, sortOrder: number, endDate: Date, startDate: Date) {
                    this.attributeId = attributeId;
                    this.name = name;
                    this.category = category;
                    this.categoryId = categoryId;
                    this.categoryDescription = categoryDescription;
                    this.sortOrder = sortOrder;
                    this.endDate = endDate;
                    this.startDate  = startDate;
    }
}
