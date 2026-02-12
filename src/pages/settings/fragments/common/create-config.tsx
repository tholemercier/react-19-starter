import { PlusCircleIcon } from "@heroicons/react/24/solid";
import type { UseMutationResult } from "@tanstack/react-query";
import { useToggle } from "react-use";

import { Button } from "src/components/button";
import type { QueryError } from "src/libs/api";

import { ConfigModal } from "../common/config-modal";

import type { ConfigType } from "./settings-config.types";

export const CreateConfig = <T,>({
  config,
  useCreateConfig,
  useUpdateConfig,
}: {
  config: ConfigType<T>;
  useCreateConfig: (onSuccess?: () => void) => UseMutationResult<void, QueryError, Partial<T>, unknown>;
  useUpdateConfig: (key: T, onSuccess?: () => void) => UseMutationResult<void, QueryError, Partial<T>, unknown>;
}) => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <>
      <div className="flex justify-end">
        <Button variant="success" onClick={toggleIsOpen}>
          <PlusCircleIcon className="size-7" fill="var(--color-green-700)" />
        </Button>
      </div>
      <ConfigModal
        useCreateConfig={useCreateConfig}
        useUpdateConfig={useUpdateConfig}
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        config={config}
        isCreate
      />
    </>
  );
};
