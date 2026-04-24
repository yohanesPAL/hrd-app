"use client";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { useCallback, useRef } from "react";

export function useExecuteAction() {
  const promiseRef = useRef<Promise<any> | null>(null);
  const {setIsSubmitting} = useConfirmDelete();

  const executeAction = useCallback(
    async <T extends (...args: any[]) => Promise<any>>(
      action: T,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> => {
      if (promiseRef.current) {
        return promiseRef.current;
      }

      setIsSubmitting(true);
      const promise = action(...args);
      promiseRef.current = promise;

      try {
        return await promise;
      } finally {
        promiseRef.current = null;
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { executeAction, isLocked: promiseRef.current };
}
