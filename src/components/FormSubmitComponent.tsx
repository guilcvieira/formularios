'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { FormElementInstance, FormElements } from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from 'sonner';
import { ImSpinner2 } from 'react-icons/im';
import { SubmitFunction } from '@actions/form';
import { TrackFormEvent } from '@actions/analytics';

function generateSessionId() {
  return crypto.randomUUID();
}

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
    return 'mobile';
  return 'desktop';
}

export default function FormSubmitComponent({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const sessionIdRef = useRef(generateSessionId());
  const startTimeRef = useRef(Date.now());
  const interactedFieldsRef = useRef(new Set<string>());

  // Track form_start on mount
  useEffect(() => {
    TrackFormEvent(
      formUrl,
      sessionIdRef.current,
      'form_start',
      undefined,
      JSON.stringify({ device: detectDevice() }),
    );
  }, [formUrl]);

  // Track form_abandon on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!submitted) {
        navigator.sendBeacon(
          '/api/track-abandon',
          JSON.stringify({
            formUrl,
            sessionId: sessionIdRef.current,
          }),
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formUrl, submitted]);

  const trackFieldInteraction = useCallback(
    (fieldId: string) => {
      if (interactedFieldsRef.current.has(fieldId)) return;
      interactedFieldsRef.current.add(fieldId);
      TrackFormEvent(
        formUrl,
        sessionIdRef.current,
        'field_interaction',
        fieldId,
      );
    },
    [formUrl],
  );

  const validateForm: () => boolean = useCallback(() => {
    let hasErrors = false;

    content.forEach((element) => {
      const value = formValues.current[element.id] || '';
      const valid = FormElements[element.type].validateFormElement(
        element,
        value,
      );
      if (!valid) {
        formErrors.current[element.id] = true;
        hasErrors = true;
        // Track field error
        TrackFormEvent(
          formUrl,
          sessionIdRef.current,
          'field_error',
          element.id,
        );
      } else {
        formErrors.current[element.id] = false;
      }
    });

    return !hasErrors;
  }, [content, formUrl]);

  const submitValue = useCallback(
    (key: string, value: string) => {
      formValues.current[key] = value;
      trackFieldInteraction(key);
    },
    [trackFieldInteraction],
  );

  const submitForm = async () => {
    formErrors.current = {};
    const isValid = validateForm();

    if (!isValid) {
      toast.error('Please fill out all required fields correctly.');
      setRenderKey(new Date().getTime());
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      const timeToComplete = Math.round(
        (Date.now() - startTimeRef.current) / 1000,
      );
      const device = detectDevice();
      await SubmitFunction(formUrl, jsonContent, timeToComplete, device);
      setSubmitted(true);
    } catch (error) {
      toast.error('An error occurred while submitting the form.');
      console.error('Form submission error:', error);
      setRenderKey(new Date().getTime());
      return;
    }
  };

  if (submitted) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="bg-background border-border flex w-full max-w-[620px] flex-grow flex-col gap-4 rounded border p-8 shadow-xl shadow-blue-700">
          <h2 className="text-lg font-semibold">
            Form Submitted Successfully!
          </h2>
          <p className="text-muted-foreground">
            Thank you for your submission. We will get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div
        key={renderKey}
        className="bg-background border-border flex w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded border p-8 shadow-xl shadow-blue-700"
      >
        {content.map((element, index) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={index}
              element={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8 cursor-pointer space-x-2"
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={pending}
        >
          {!pending && (
            <>
              <HiCursorClick />
              Submit
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
