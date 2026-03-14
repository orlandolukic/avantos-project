import {DAGConnection} from "./DAGConnection";

export interface FormBlueprints {
    forms: any[];
    edges: DAGConnection[];
    nodes: any[];
}