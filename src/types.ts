export type CreateNewIssueArgs = {
  projectId: string;
  title?: string;
  description: string;
  stepsToReproduce?: string;
}