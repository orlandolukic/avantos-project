import {DAGNode} from "./DAGNode";

export interface DAGForm {
    id: string;
    name: string;
    description: string;
    field_schema: DAGFormFieldSchema
}

export interface DAGFormFieldSchema {
    properties: Record<string, DAGFormField>
}

export interface DAGFormField {
    avantos_type: string;
    items: any;
    type: string;
}