


export default class DAGSubstitutionCustomGroup {

    private groupId: string;
    private groupName: string;
    private groupValues: string[];

    constructor(groupId: string, groupName: string) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.groupValues =  [];
    }

    public addCustomField(value: string): void {
        const hasField: boolean = this.hasValue(value);
        if (!hasField) {
            this.groupValues.push(value);
        }
    }

    public getGroupId(): string {
        return this.groupId;
    }

    public getGroupName(): string {
        return this.groupName;
    }

    public getValues(): string[] {
        return [...this.groupValues];
    }

    public getValueAt(index: number): string | null {
        if (index < 0 || index >= this.groupValues.length) {
            return null;
        }
        return this.groupValues[index];
    }

    public hasValue(value: string): boolean {
        return this.groupValues.filter((valueArr: string) => valueArr === value).length > 0;
    }

}