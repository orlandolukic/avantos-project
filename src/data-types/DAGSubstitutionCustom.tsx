import DAGSubstitutionCustomGroup from "./DAGSubstitutionCustomGroup";

export default class DAGSubstitutionCustom {

    private group: DAGSubstitutionCustomGroup;
    private selectedIndex: number;

    constructor(group: DAGSubstitutionCustomGroup, selectedIndex: number) {
        this.group = group;
        this.selectedIndex = selectedIndex;
    }

    public setCustomSubstitution(group: DAGSubstitutionCustomGroup, selectedIndex: number): void {
        this.group = group;
        this.selectedIndex = selectedIndex;
    }

    public selectValue(value: string): number {
        const values: string[] = this.group.getValues();
        for(let i=0; i<values.length; i++) {
            if (values[i] === value) {
                this.selectedIndex = i;
                return i;
            }
        }
        return -1;
    }

    public getGroup(): DAGSubstitutionCustomGroup {
        return this.group;
    }

    public getFieldValue(): string | null {
        return this.group.getValueAt(this.selectedIndex);
    }

}