import { Form } from './Form';
export * from './types';
export * as API from './api';
export declare const init: () => void;
declare global {
    interface Window {
        bhwf: {
            init: () => void;
            forms: {
                [projectId: string]: Form;
            };
        };
    }
}
