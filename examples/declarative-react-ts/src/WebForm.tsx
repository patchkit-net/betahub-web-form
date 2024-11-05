import React, { useEffect, useMemo, useRef, useState } from "react";
import BHWF, { transformIntoDropzone } from "betahub-web-form";
import { Id, toast } from "react-toastify";

export const WebForm = ({ projectId }: { projectId: string }) => {
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionErrorMsgRef = useRef<HTMLSpanElement>(null);
  const stepsToReproduceInputRef = useRef<HTMLTextAreaElement>(null);
  const stepsToReproduceErrorMsgRef = useRef<HTMLSpanElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mediaErrorMsgRef = useRef<HTMLSpanElement>(null);

  const [areAllInputsLoaded, setAreAllInputsLoaded] = useState(false);
  const [areFileInputsTransformed, setAreFileInputsTransformed] =
    useState(false);

  // Check if all inputs are loaded
  useEffect(() => {
    if (
      descriptionInputRef.current &&
      descriptionErrorMsgRef.current &&
      stepsToReproduceInputRef.current &&
      stepsToReproduceErrorMsgRef.current &&
      mediaInputRef.current &&
      mediaErrorMsgRef.current
    ) {
      setAreAllInputsLoaded(true);
    }
  }, [
    descriptionInputRef.current,
    descriptionErrorMsgRef.current,
    stepsToReproduceInputRef.current,
    stepsToReproduceErrorMsgRef.current,
    mediaInputRef.current,
    mediaErrorMsgRef.current,
  ]);

  // Transform file inputs into dropzones
  useEffect(() => {
    if (areAllInputsLoaded && !areFileInputsTransformed) {
      transformIntoDropzone(mediaInputRef.current as HTMLInputElement);
      setAreFileInputsTransformed(true);
    }
  }, [areAllInputsLoaded, areFileInputsTransformed]);

  const form = useMemo(
    () =>
      areAllInputsLoaded
        ? new BHWF.Form({
            projectId,
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
    [areAllInputsLoaded]
  );

  // Handle events
  useEffect(() => {
    let toastId: Id;
    if (form) {
      form.on("inputError", (data) => {
        toast.error(data?.message);
      });
      form.on("loading", () => {
        toastId = toast(
          <div className="Toastify__toast-body">
            <div className="Toastify__toast-icon">
              <div className="Toastify__spinner" />
            </div>
            <div>Sending...</div>
          </div>,
          { autoClose: false }
        );
      });
      form.on("apiError", (data) => {
        if (data?.status === 404) data.message = "Project not found";
        toast.update(toastId, { render: data?.message, type: "error" });
      });
      form.on("success", () => {
        toast.update(toastId, { render: "Thank you for submitting your issue!", type: "success" });
      });
    }
  }, [form]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (form?.validate()) {
      form?.submit();
    }
  };

  const handleInput = () => {
    form?.cleanErrors();
  };

  return (
    <form className="bhwf-form" onInput={handleInput}>
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

      <button id="submit-button" className="bhwf-button" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default WebForm;
