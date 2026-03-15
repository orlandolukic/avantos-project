import {DAGNode} from "./DAGNode";
import {DAGConnection} from "./DAGConnection";
import LinkedList from "./LinkedList";
import {DAGForm} from "./DAGForm";
import DAGSubstitution from "./DAGSubstitution";

export type DAGType = {
    initialize: (paramNodes: DAGNode[], edges: DAGConnection[], paramForms: DAGForm[]) => void,
    hasEdge: (nodeFrom: DAGNode, nodeTo: DAGNode) => boolean,
    availableFormsFor: (formId: string) => DAGNode[],
    print: () => void,
    printNodes: () => void,
    getNode: (id: string) => DAGNode | null,
    getForm: (id: string) => DAGForm | null,
    getNodeForForm: (form: DAGForm) => DAGNode | null,
    getSubstitutionFor: (fieldName: string, node: DAGNode) => DAGSubstitution | null,
    clearSubstitutionFor: (fieldName: string, node: DAGNode) => void,
    setSubstitutionFor: (fieldName: string, node: DAGNode | null, substitute: DAGSubstitution | null) => void
};

export default function DAG(): DAGType {

    let nodeCount = 0;
    let nodeToIndex: Record<string, number> = {};
    let nodes: DAGNode[] = [];
    let adjacencyMatrix: any = [];

    let formCount: number = 0;
    let formToIndex: Record<string, number> = {};
    let forms: Record<string, DAGForm> = {};

    const getIndex = function(id: string): number {
        const index: number = nodeToIndex[id];
        if (index === undefined) {
            throw new Error("Returned index -1 for id " + id + ", please check this error");
        }
        return index;
    }

    const getFormIndex = function(id: string): number {
        const index: number = formToIndex[id];
        if (index === undefined) {
            throw new Error("Returned index -1 for id " + id + ", please check this error");
        }
        return index;
    };

    const initialize = function(paramNodes: DAGNode[], edges: DAGConnection[], paramForms: DAGForm[]) {
        // We are resetting everything each time we run this function
        nodeToIndex = {};
        nodes = [];
        adjacencyMatrix = [];
        nodeCount = paramNodes.length;

        for (let i=0; i<paramForms.length; i++) {
            forms[paramForms[i].id] = paramForms[i];
            formToIndex[paramForms[i].id] = i;
        }

        for (let i=0; i<paramNodes.length; i++) {
            nodeToIndex[paramNodes[i].id] = i;
            nodes[i] = paramNodes[i];

            // Create subarray for adjacency matrix
            const subArr = [];
            for (let j=0; j<paramNodes.length; j++) {
                subArr[j] = false;
            }
            adjacencyMatrix.push(subArr);

            // Connect forms with their nodes
            const formId = paramNodes[i].component_id;
            const selectedForm = forms[formId];
            nodes[i].form = selectedForm;
        }

        for (let i=0; i<edges.length; i++) {
            const connection: DAGConnection = edges[i];
            const sourceId: string = connection.source;
            const targetId: string = connection.target;
            const sourceIndex: number = getIndex(sourceId);
            const targetIndex: number = getIndex(targetId);

            // We create connections
            adjacencyMatrix[sourceIndex][targetIndex] = true;
        }
    };

    const hasEdge = function(nodeFrom: DAGNode, nodeTo: DAGNode): boolean {
        const fromIndex: number = getIndex(nodeFrom.id);
        const toIndex: number = getIndex(nodeTo.id);
        return adjacencyMatrix[fromIndex][toIndex];
    }

    /**
     * This is the core function for determining available forms for the user
     * @param formId ID of the form (in previous example form E)
     */
    const availableFormsFor = function(formId: string): DAGNode[] {
        const index = getIndex(formId);

        // Now we check columns for the selected node
        const result: DAGNode[] = [];
        const queue: LinkedList<DAGNode> = new LinkedList();
        const present: Record<string, boolean> = {};
        // Put the current node into the list, for the first time
        queue.insert(nodes[index]);

        // We take elements one by one until the queue is empty
        while(queue.hasElements()) {
            const node: DAGNode | null = queue.remove();
            if (node === null) {
                throw new Error("Node is null");
            }

            const ind = getIndex(node.id);
            if (formId !== node.id) {
                result.push(node);
            }

            for (let i=0; i<nodeCount; i++) {
                // Row is traversable, column is fixed!
                if (adjacencyMatrix[i][ind] && !present[nodes[i].id]) {
                    queue.insert(nodes[i]);
                    // Remove duplicates (i.e already visited nodes)!
                    present[nodes[i].id] = true;
                }
            }
        }

        return result;
    }

    const getNode = function(id: string): DAGNode | null {
        const node: DAGNode = nodes[getIndex(id)];
        if (node === undefined) {
            return null;
        }
        return node;
    };

    const getForm = function(nodeId: string): DAGForm | null {
        const node: DAGNode = nodes[getIndex(nodeId)];
        if (node === undefined) {
            return null;
        }
        return node.form;
    };

    const print = function(): void {
        for (let i=0; i<nodeCount; i++) {
            let str = nodes[i].name + "\t\t";
            for (let j=0; j<nodeCount; j++) {
                str += ( adjacencyMatrix[i][j] ? 1 : 0 ) + "\t";
            }
            console.log(str);
        }
    }

    const printNodes = function(): void {
        for (let i=0; i<nodeCount; i++) {
            console.log(nodes[i]);
        }
    }

    const getSubstitutionFor = function(fieldName: string, node: DAGNode): DAGSubstitution | null {
        if (node.substitutions) {
            if ( node.substitutions.hasOwnProperty(fieldName) ) {
                return node.substitutions[fieldName] as DAGSubstitution;
            } else {
                return null;
            }
        }
        return null;
    }

    const clearSubstitutionFor = function(fieldName: string, node: DAGNode): void {
        if (node.substitutions) {
            if ( node.substitutions.hasOwnProperty(fieldName) ) {
                const newSubstitions: Record<string, DAGSubstitution> = {};
                for (let key in node.substitutions) {
                    // Skip this field
                    if (key === fieldName) {
                        continue;
                    }
                    newSubstitions[key] = node.substitutions[key];
                }
                // Replace old substitutions with new ones
                node.substitutions = newSubstitions;
            }
        }
    }

    const setSubstitutionFor = function(fieldName:string, node: DAGNode | null, substitute: DAGSubstitution | null): void {
        if (node === null || substitute === null) {
            return;
        }
        if (!node.substitutions) {
            node.substitutions = {};
        }
        node.substitutions[fieldName] = substitute;
    }

    const getNodeForForm = function(form: DAGForm): DAGNode | null {
        const formId: string = form.id;
        for (let i =0; i<nodes.length; i++) {
            if (nodes[i].form?.id === formId) {
                return nodes[i];
            }
        }
        return null;
    }

    return {
        initialize: initialize,
        hasEdge: hasEdge,
        availableFormsFor: availableFormsFor,
        print: print,
        printNodes: printNodes,
        getNode: getNode,
        getForm: getForm,
        getNodeForForm: getNodeForForm,

        getSubstitutionFor: getSubstitutionFor,
        clearSubstitutionFor: clearSubstitutionFor,
        setSubstitutionFor: setSubstitutionFor
    };
}