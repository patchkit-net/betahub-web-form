import React, { useEffect, useMemo, useRef, useState } from "react";
import BHWF, { transformIntoDropzone, Dropzone } from "betahub-web-form";

export const WebForm = ({
  projectId,
  apiKey,
}: {
  projectId: string;
  apiKey: string;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionErrorMsgRef = useRef<HTMLSpanElement>(null);
  const stepsToReproduceInputRef = useRef<HTMLTextAreaElement>(null);
  const stepsToReproduceErrorMsgRef = useRef<HTMLSpanElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mediaErrorMsgRef = useRef<HTMLSpanElement>(null);
  const loadingModalRef = useRef<HTMLDivElement>(null);
  const errorModalRef = useRef<HTMLDivElement>(null);
  const successModalRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [mediaInputDropzone, setMediaInputDropzone] = useState<Dropzone | null>(
    null
  );
  const [apiErrorMsg, setApiErrorMsg] = useState<string>('');

  const [areAllInputsLoaded, setAreAllInputsLoaded] = useState(false);
  const [areFileInputsTransformed, setAreFileInputsTransformed] =
    useState(false);

  // Check if all inputs are loaded
  useEffect(() => {
    if (
      formRef.current &&
      descriptionInputRef.current &&
      descriptionErrorMsgRef.current &&
      stepsToReproduceInputRef.current &&
      stepsToReproduceErrorMsgRef.current &&
      mediaInputRef.current &&
      mediaErrorMsgRef.current &&
      loadingModalRef.current &&
      errorModalRef.current &&
      successModalRef.current &&
      submitButtonRef.current
    ) {
      setAreAllInputsLoaded(true);
    }
  }, [
    formRef.current,
    descriptionInputRef.current,
    descriptionErrorMsgRef.current,
    stepsToReproduceInputRef.current,
    stepsToReproduceErrorMsgRef.current,
    mediaInputRef.current,
    mediaErrorMsgRef.current,
    loadingModalRef.current,
    errorModalRef.current,
    successModalRef.current,
    submitButtonRef.current,
  ]);

  // Transform file inputs into dropzones
  useEffect(() => {
    if (areAllInputsLoaded && !areFileInputsTransformed) {
      const mediaDropzone = transformIntoDropzone(
        mediaInputRef.current as HTMLInputElement
      );
      setMediaInputDropzone(mediaDropzone);
      setAreFileInputsTransformed(true);
    }
  }, [areAllInputsLoaded, areFileInputsTransformed]);

  const form = useMemo(
    () =>
      areAllInputsLoaded && areFileInputsTransformed
        ? new BHWF.Form({
            projectId,
            apiKey,
            customElements: {
              description: {
                inputElement: descriptionInputRef.current || undefined,
                errorMsgElement: descriptionErrorMsgRef.current || undefined,
              },
              stepsToReproduce: {
                inputElement: stepsToReproduceInputRef.current || undefined,
                errorMsgElement:
                  stepsToReproduceErrorMsgRef.current || undefined,
                validator: (value) => {
                  if (!value) {
                    return [false, "Steps to reproduce are required"];
                  }
                  return [true, undefined];
                },
              },
              media: {
                inputElement: mediaInputRef.current || undefined,
                errorMsgElement: mediaErrorMsgRef.current || undefined,
                dropzone: mediaInputDropzone || undefined,
                validator: (value) => {
                  if (value.length === 0) {
                    return [false, "Media is required"];
                  }
                  return [true, undefined];
                },
              },
            },
          })
        : undefined,
    [areAllInputsLoaded, areFileInputsTransformed]
  );

  // Handle events
  useEffect(() => {
    if (form) {
      form.on("inputError", () => {
        formRef.current?.classList.add("bhwf-error");
        submitButtonRef.current?.setAttribute("disabled", "true");
      });
      form.on("cleanErrors", () => {
        formRef.current?.classList.remove("bhwf-error");
        submitButtonRef.current?.removeAttribute("disabled");
      });
      form.on("loading", () => {
        loadingModalRef.current?.classList.add("bhwf-modal-show");
      });
      form.on("apiError", (data) => {
        loadingModalRef.current?.classList.remove("bhwf-modal-show");
        errorModalRef.current?.classList.add("bhwf-modal-show");
        setApiErrorMsg(data?.message || '');
      });
      form.on("success", () => {
        loadingModalRef.current?.classList.remove("bhwf-modal-show");
        successModalRef.current?.classList.add("bhwf-modal-show");
      });
      form.on("reset", () => {
        successModalRef.current?.classList.remove("bhwf-modal-show");
      });
    }
  }, [form]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    errorModalRef.current?.classList.remove("bhwf-modal-show");
    if (form?.validate()) {
      form?.submit();
    }
  };

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    errorModalRef.current?.classList.remove("bhwf-modal-show");
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    errorModalRef.current?.classList.remove("bhwf-modal-show");
    form?.reset();
  };
  

  return (
    <form
      ref={formRef}
      className="bhwf-form"
      onInput={() => form?.cleanErrors()}
    >
      <h1>Example</h1>

      <label>Issue Description</label>
      <textarea
        ref={descriptionInputRef}
        className="bhwf-input"
        placeholder="Describe your issue as detailed as possible"
      ></textarea>
      <span ref={descriptionErrorMsgRef} className="bhwf-error-msg"></span>

      <label>Steps to Reproduce</label>
      <textarea
        ref={stepsToReproduceInputRef}
        className="bhwf-input"
        placeholder="Describe the steps leading to the issue"
      ></textarea>
      <span ref={stepsToReproduceErrorMsgRef} className="bhwf-error-msg"></span>

      <label>Attach Media</label>
      <input ref={mediaInputRef} className="bhwf-input" type="file" multiple />
      <span ref={mediaErrorMsgRef} className="bhwf-error-msg"></span>

      <button
        ref={submitButtonRef}
        className="bhwf-button"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div ref={loadingModalRef} className="bhwf-modal">
        <div className="bhwf-loader"></div>
      </div>

      <div ref={errorModalRef} className="bhwf-modal">
        <h2>Something went wrong!</h2>
        <p>Your issue couldn't be sent right now</p>
        <p className="bhwf-error-msg">{apiErrorMsg}</p>
        <br />
        <button className="bhwf-button" onClick={handleRetry}>
          Try again
        </button>
        <button className="bhwf-button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div ref={successModalRef} className="bhwf-modal">
        <h2>All done!</h2>
        <p>Thank you for submitting your issue</p>
        <br />
        <button className="bhwf-button" onClick={handleReset}>
          Submit another issue
        </button>
      </div>
    </form>
  );
};

export default WebForm;
