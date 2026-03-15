import {DAGNode} from "./DAGNode";
import DAGSubstitutionCustom from "./DAGSubstitutionCustom";

export default class DAGSubstitution {
    public static readonly DAGSubstitutionNode: number = 0;
    public static readonly DAGSubstitutionCustom: number = 1;

    private type: number;
    private node: DAGNode;
    private custom: DAGSubstitutionCustom;
    private fieldName: string;
    private fieldNameSubstitution: string;

    constructor(fieldName: string, fieldNameSubstitution: string) {
        this.type = DAGSubstitution.DAGSubstitutionNode;
        this.node = {} as DAGNode;
        this.fieldName = fieldName;
        this.fieldNameSubstitution = fieldNameSubstitution;
        this.custom = {} as DAGSubstitutionCustom;
    }

    public setSubstitution(substitute: DAGNode | DAGSubstitutionCustom | null): void {
        if (substitute === null) {
            return;
        }
        if (substitute instanceof DAGSubstitutionCustom) {
            const custom: DAGSubstitutionCustom = substitute as DAGSubstitutionCustom;
            this.custom = custom;
            this.type = DAGSubstitution.DAGSubstitutionCustom;
        } else {
            const node: DAGNode = substitute as DAGNode;
            this.node = node;
            this.type = DAGSubstitution.DAGSubstitutionNode;
        }
    }

    public setFieldName(fieldName: string): void {
        this.fieldName = fieldName;
    }

    public getFieldName(): string {
        return this.fieldName;
    }

    public getFieldNameSubstitution(): string {
        return this.fieldNameSubstitution;
    }

    public getType(): number {
        return this.type;
    }

    public getDisplayText(): string {
        if (this.type === DAGSubstitution.DAGSubstitutionNode) {
            return this.fieldName + ": " + this.node?.name + "." + this.fieldNameSubstitution;
        } else {
            return this.fieldName + ": " + this.custom?.getGroup().getGroupName() + " - value: " + this.custom?.getFieldValue();
        }
    }
}