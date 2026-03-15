import {DAGForm} from "./DAGForm";
import DAGSubstitution from "./DAGSubstitution";


export type DAGNode = {
    id: string;
    name: string;
    position: {
        x: number;
        y: number;
    };
    component_id: string;
    form: DAGForm | null;
    substitutions: Record<string, DAGSubstitution> | null;
}