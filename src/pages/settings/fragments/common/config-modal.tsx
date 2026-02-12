import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import type { UseMutationResult } from "@tanstack/react-query";
import clsx from "clsx";

import { Button } from "src/components/button";
import { Modal } from "src/components/modal";
import { ModalTitle } from "src/components/modal/modal-title";
import { Spinner } from "src/components/spinner";
import type { QueryError } from "src/libs/api";

import type { ConfigItemType, ConfigType } from "./settings-config.types";

type CommonProps<T> = {
  toggleIsOpen: () => void;
  config: ConfigType<T>;
  isOpen: boolean;
  useCreateConfig: (onSuccess?: () => void) => UseMutationResult<void, QueryError, Partial<T>, unknown>;
  useUpdateConfig: (key: T, onSuccess?: () => void) => UseMutationResult<void, QueryError, Partial<T>, unknown>;
};
type InputProps<T> =
  | {
      isCreate: true;
      data?: never;
    }
  | {
      isCreate?: false;
      data?: T;
    };

export const ConfigModal = <T,>({
  config,
  useCreateConfig,
  useUpdateConfig,
  data,
  toggleIsOpen,
  isOpen,
  isCreate = false,
}: InputProps<T> & CommonProps<T>) => {
  const initialConfig = useMemo(() => {
    const o = {} as T;
    for (const [k, c] of Object.entries<ConfigItemType<T>>(config)) {
      o[k as keyof T] = c.value(data) as T[keyof T];
    }
    return o;
  }, [config, data]);

  const [dirtyData, setDirtyData] = useState(initialConfig);

  useEffect(() => {
    if (data) {
      setDirtyData(data);
    }
  }, [data]);

  const onDirtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setDirtyData(
      (p) =>
        ({
          ...p,
          [name]: value,
        }) as T,
    );
  }, []);

  const onCancel = useCallback(() => {
    setDirtyData(initialConfig);
    toggleIsOpen();
  }, [initialConfig, toggleIsOpen]);

  const createConfig = useCreateConfig();

  const updateConfig = useUpdateConfig(initialConfig);

  const onSave = useCallback(async () => {
    await (isCreate ? createConfig.mutateAsync(dirtyData) : updateConfig.mutateAsync(dirtyData));
    setDirtyData(initialConfig);
    toggleIsOpen();
  }, [createConfig, dirtyData, initialConfig, isCreate, toggleIsOpen, updateConfig]);

  const isPending = updateConfig.isPending || createConfig.isError;
  const isError = updateConfig.isError || createConfig.isError;

  const entries = useMemo(() => Object.entries<ConfigItemType<T>>(config), [config]);

  return (
    <Modal isOpen={isOpen} className={clsx("w-xl")}>
      <ModalTitle>Update Config</ModalTitle>
      <div className="mb-6 flex flex-col gap-4">
        {entries.map(([k, c]) => (
          <Fragment key={k}>{c.renderInput(k as keyof T, c, dirtyData, isCreate, onDirtyChange)}</Fragment>
        ))}
        {!isPending && isError && (
          <div className="pl-2 font-semibold text-red-700">Unable to {isCreate ? "create" : "update"} the Config</div>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {updateConfig.isPending ? (
          <Spinner />
        ) : (
          <Button variant="brand" onClick={onSave} disabled={!isCreate && !dirtyData}>
            {isCreate ? "Create" : "Update"}
          </Button>
        )}
        <Button variant="error" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
