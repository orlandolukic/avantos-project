import DAGSubstitutionCustomGroup from "./DAGSubstitutionCustomGroup";


export default class DAGSubstitutionCustomGroups {

    private static instance: DAGSubstitutionCustomGroups | null = null;
    private static hasFetchedDynamicSubstitutions: boolean = false;
    public static async fetchDynamicSubstitutionGroups(): Promise<DAGSubstitutionCustomGroup[]> {
        return new Promise<DAGSubstitutionCustomGroup[]>((resolve) => {
            if (DAGSubstitutionCustomGroups.hasFetchedDynamicSubstitutions) {
                resolve([] as DAGSubstitutionCustomGroup[]);
                return;
            }

            // Add static groups
            const actionPropertiesGroup: DAGSubstitutionCustomGroup = new DAGSubstitutionCustomGroup( "action-properties", "Action Properties");
            actionPropertiesGroup.addCustomField("value1");
            actionPropertiesGroup.addCustomField("value2");
            actionPropertiesGroup.addCustomField("value3");
            actionPropertiesGroup.addCustomField("VALUE TEST");

            const clientOrganizationPropertiesGroup: DAGSubstitutionCustomGroup = new DAGSubstitutionCustomGroup( "client-org", "Client Organization Properties");
            clientOrganizationPropertiesGroup.addCustomField("test1");
            clientOrganizationPropertiesGroup.addCustomField("test2");
            clientOrganizationPropertiesGroup.addCustomField("test3");

            DAGSubstitutionCustomGroups.getInstance()
                .putNewGroup(actionPropertiesGroup)
                .putNewGroup(clientOrganizationPropertiesGroup);

            // Do the AXIOS fetching...
            // ...
            const response = [] as DAGSubstitutionCustomGroup[];
            response.forEach((group: DAGSubstitutionCustomGroup) => {
                // Add each group
                DAGSubstitutionCustomGroups.getInstance().putNewGroup(group);
            })
            DAGSubstitutionCustomGroups.hasFetchedDynamicSubstitutions = true;
            resolve([] as DAGSubstitutionCustomGroup[]);
        });
    }

    public static getInstance(): DAGSubstitutionCustomGroups {
        if (DAGSubstitutionCustomGroups.instance === null) {
            DAGSubstitutionCustomGroups.instance = new DAGSubstitutionCustomGroups();
        }
        return DAGSubstitutionCustomGroups.instance;
    }

    private groups: DAGSubstitutionCustomGroup[];

    private constructor() {
        this.groups = [];
    }

    public putNewGroup(group: DAGSubstitutionCustomGroup): DAGSubstitutionCustomGroups {
        this.groups.push(group);
        return this;
    }

    public getAllGroups(): DAGSubstitutionCustomGroup[] {
        return this.groups;
    }

    public getGroupByName(name: string): DAGSubstitutionCustomGroup {
        for (let i=0; i<this.groups.length; i++) {
            if (this.groups[i].getGroupName() === name) {
                return this.groups[i];
            }
        }
        return {} as DAGSubstitutionCustomGroup;
    }

    public getGroupById(id: string): DAGSubstitutionCustomGroup {
        for (let i=0; i<this.groups.length; i++) {
            if (this.groups[i].getGroupId() === id) {
                return this.groups[i];
            }
        }
        return {} as DAGSubstitutionCustomGroup;
    }

}