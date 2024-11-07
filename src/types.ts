import { Form } from "./Form";
import { FileInput } from "./inputs/FileInput";
import { Input } from "./inputs/Input";

export interface BHWFI {
  Form: typeof Form;
  API: API;
  autoInit: () => void;
  forms: { [projectId: string]: Form };
};
declare global {
  interface Window {
    BHWF: BHWFI;
  }
}

export type EventType = keyof EventDataMap;
export interface EventDataMap {
  loading: undefined;
  success: { issueId?: number, issueUrl?: string };
  inputError: { message?: string; input: Input | FileInput };
  apiError: { message?: string; status: number };
  progress: { progress?: number; message?: string };
  reset: undefined;
  cleanErrors: undefined;
};

export type InputName =
  | "description"
  | "stepsToReproduce"
  | "screenshots"
  | "videos"
  | "logs"
  | "media";

export type FormElements = {
  [key in InputName]: {
    inputElement?: HTMLInputElement | HTMLTextAreaElement;
    errorMsgElement?: HTMLElement;
    dropzone?: Dropzone;
    validator?: (value: string | File[]) => [boolean, string | undefined];
  };
};

export type API = {
  createNewIssue: (args: CreateNewIssueArgs) => Promise<CreateNewIssueResponse>;
  uploadScreenshot: (
    args: UploadScreenshotArgs
  ) => Promise<UploadScreenshotResponse>;
  uploadVideoClip: (
    args: UploadVideoClipArgs
  ) => Promise<UploadVideoClipResponse>;
  uploadLogFile: (args: UploadLogFileArgs) => Promise<UploadLogFileResponse>;
};

export type CreateNewIssueArgs = {
  projectId: string;
  apiKey: string;
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
  steps_to_reproduce: Array<{ step: string }>;
  title: string;
  updated_at: string;
  url: string;
};

export type UploadScreenshotArgs = {
  projectId: string;
  apiKey: string;
  issueId: number;
  screenshot: Blob;
};

export type UploadScreenshotResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  status: number;
  description: null | string;
  issue_id: number;
  media_size_bytes: number;
};

export type UploadVideoClipArgs = {
  projectId: string;
  apiKey: string;
  issueId: number;
  videoClip: Blob;
};

export type UploadVideoClipResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  processing: boolean;
  processed: boolean;
  failed: boolean;
  media_size_bytes: number;
};

export type UploadLogFileArgs = {
  projectId: string;
  apiKey: string;
  issueId: number;
  logFile: Blob;
};

export type UploadLogFileResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  media_size_bytes: number;
};
