"use client";
import { useCallback, useTransition } from "react";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";

export function useExecuteAction() {
  const { setIsPosting, setClose } = useConfirmDelete();
  const [isSuspense, startTransition] = useTransition();

  const executeAction = useCallback(
    async <T extends (...args: any[]) => Promise<any>>(
      action: T,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> => {
      setIsPosting(true);

      try {
        return await action(...args);
      } finally {
        startTransition(() => {
          setIsPosting(false);
          setClose();
        })
      }
    },
    [setIsPosting]
  );

  return { executeAction, isSuspense };
}