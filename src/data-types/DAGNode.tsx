import {DAGForm} from "./DAGForm";


export interface DAGNode {
    id: string;
    name: string;
    position: {
        x: number;
        y: number;
    };
    component_id: string;
    form: DAGForm | null;
    substitutions: Record<string, DAGNode> | null;
}