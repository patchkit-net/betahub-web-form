import { CreateNewIssueArgs, CreateNewIssueResponse } from "./types";

const ENDPOINT = 'http://localhost';

export const createNewIssue = async ({
  projectId,
  title,
  description,
  stepsToReproduce,
}: CreateNewIssueArgs): Promise<CreateNewIssueResponse> => {
  const params = new URLSearchParams();
  if (title) params.append('issue[title]', title);
  params.append('issue[description]', description);
  if (stepsToReproduce) params.append('issue[unformatted_steps_to_reproduce]', stepsToReproduce);

  const response = await fetch(
    `${ENDPOINT}/projects/${projectId}/issues.json`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'FormUser anonymous',
        'BetaHub-Project-ID': projectId,
      },
      body: params.toString()
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const uploadScreenshot = async ({
  projectId,
  issueId,
  screenshot,
}: {
  projectId: string;
  issueId: string;
  screenshot: Blob;
}) => {
  const formData = new FormData();
  formData.append('screenshot[image]', screenshot);

  const response = await fetch(
    `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/screenshots`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'FormUser anonymous',
        'BetaHub-Project-ID': projectId,
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const uploadVideoClip = async ({
  projectId,
  issueId,
  videoClip,
}: {
  projectId: string;
  issueId: string;
  videoClip: Blob;
}) => {
  const formData = new FormData();
  formData.append('video_clip[video]', videoClip);

  const response = await fetch(
    `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/video_clips`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'FormUser anonymous',
        'BetaHub-Project-ID': projectId,
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const uploadLogFile = async ({
  projectId,
  issueId,
  logFile,
}: {
  projectId: string;
  issueId: string;
  logFile: Blob;
}) => {
  const formData = new FormData();
  formData.append('log_file[file]', logFile);

  const response = await fetch(
    `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/log_files`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'FormUser anonymous',
        'BetaHub-Project-ID': projectId,
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};