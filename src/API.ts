import {
  CreateNewIssueArgs,
  CreateNewIssueResponse,
  UploadLogFileArgs,
  UploadLogFileResponse,
  UploadScreenshotArgs,
  UploadScreenshotResponse,
  UploadVideoClipArgs,
  UploadVideoClipResponse,
} from "./types";

// const ENDPOINT = 'http://localhost';
const ENDPOINT = "https://app.betahub.io";

export const createNewIssue = ({
  projectId,
  apiKey,
  title,
  description,
  stepsToReproduce,
}: CreateNewIssueArgs): Promise<CreateNewIssueResponse> => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    if (title) params.append("issue[title]", title);
    params.append("issue[description]", description);
    if (stepsToReproduce)
      params.append("issue[unformatted_steps_to_reproduce]", stepsToReproduce);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${ENDPOINT}/projects/${projectId}/issues.json`, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", `FormUser ${apiKey}`);
    xhr.setRequestHeader("BetaHub-Project-ID", projectId);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr);
      }
    };

    xhr.onerror = () => reject(xhr);

    xhr.send(params.toString());
  });
};

export const uploadScreenshot = ({
  projectId,
  apiKey,
  issueId,
  screenshot,
  onProgress,
}: UploadScreenshotArgs & { onProgress?: (event: ProgressEvent) => void }): Promise<UploadScreenshotResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("screenshot[image]", screenshot);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/screenshots`, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `FormUser ${apiKey}`);
    xhr.setRequestHeader("BetaHub-Project-ID", projectId);

    if (onProgress) {
      xhr.upload.onprogress = onProgress;
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr);
      }
    };

    xhr.onerror = () => reject(xhr);

    xhr.send(formData);
  });
};

export const uploadVideoClip = ({
  projectId,
  apiKey,
  issueId,
  videoClip,
  onProgress,
}: UploadVideoClipArgs & { onProgress?: (event: ProgressEvent) => void }): Promise<UploadVideoClipResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("video_clip[video]", videoClip);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/video_clips`, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `FormUser ${apiKey}`);
    xhr.setRequestHeader("BetaHub-Project-ID", projectId);

    if (onProgress) {
      xhr.upload.onprogress = onProgress;
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr);
      }
    };

    xhr.onerror = () => reject(xhr);

    xhr.send(formData);
  });
};

export const uploadLogFile = ({
  projectId,
  apiKey,
  issueId,
  logFile,
  onProgress,
}: UploadLogFileArgs & { onProgress?: (event: ProgressEvent) => void }): Promise<UploadLogFileResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("log_file[file]", logFile);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${ENDPOINT}/projects/${projectId}/issues/g-${issueId}/log_files`, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `FormUser ${apiKey}`);
    xhr.setRequestHeader("BetaHub-Project-ID", projectId);

    if (onProgress) {
      xhr.upload.onprogress = onProgress;
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr);
      }
    };

    xhr.onerror = () => reject(xhr);

    xhr.send(formData);
  });
};
