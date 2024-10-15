import { BHWFData } from './types';

export * from './types';
export * from './API';

export const init = () => {
  
};

declare global {
  interface Window {
    bhwf: {
      init: () => void;
      forms: { [projectId: string]: BHWFData };
    };
  }
}

const bhwf = {
  init,
  forms: {},
};
window.bhwf = bhwf;