"use client";
import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useExecuteAction } from "./useExecuteAction";
import { toast, ToastPromiseParams } from "react-toastify";

type ActionOptions = {
  toast?: ToastPromiseParams;
  refresh?: boolean;
};

export function useActionHandler() {
  const router = useRouter();
  const { executeAction } = useExecuteAction();
  const [isPending, startTransition] = useTransition();

  const run = useCallback(
    async <T extends (...args: any[]) => Promise<any>>(
      action: T,
      args: Parameters<T>,
      options?: ActionOptions,
    ): Promise<Awaited<ReturnType<T>>> => {
      const promise = executeAction(action, ...args);

      let result: Awaited<ReturnType<T>>;

      if (options?.toast) {
        toast.promise(promise, options.toast);
      }

      result = await promise;

      if (options?.refresh) {
        startTransition(() => {
          router.refresh();
        });
      }

      return result;
    },
    [executeAction, startTransition, router],
  );

  return { run, isPending };
}
