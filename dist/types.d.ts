export type CreateNewIssueArgs = {
    projectId: string;
    title?: string;
    description: string;
    stepsToReproduce?: string;
};
export type CreateNewIssueResponse = {
    assigned_to: {
        id: null | number;
        name: null | string;
    };
    created_at: string;
    description: string;
    id: number;
    potential_duplicate: null | CreateNewIssueResponse;
    priority: string;
    reported_by: {
        id: number;
        name: string;
    };
    score: string;
    status: string;
    steps_to_reproduce: Array<{
        step: string;
    }>;
    title: string;
    updated_at: string;
    url: string;
};
