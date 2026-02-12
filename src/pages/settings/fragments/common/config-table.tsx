import { Fragment, useCallback, useMemo } from "react";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { UseMutationResult } from "@tanstack/react-query";
import clsx from "clsx";

import { IconButton } from "src/components/button/icon-button";
import type { QueryError } from "src/libs/api";

import type { ConfigItemType, ConfigType } from "./settings-config.types";

type UseDelete<T> = (d: T, onSuccess?: () => void) => UseMutationResult<void, QueryError, void, unknown>;
const DeleteAction = <T,>({ useDelete, d }: { useDelete: UseDelete<T>; d: T }) => {
  const deleteConfig = useDelete(d);

  const onDelete = useCallback(() => deleteConfig.mutateAsync(), [deleteConfig]);

  return <IconButton as={TrashIcon} variant="error" onClick={onDelete} />;
};

export const ConfigTable = <T,>({
  data,
  tableConfig,
  onEditClick,
  useDelete,
}: {
  data: T[];
  tableConfig: ConfigType<T>;
  onEditClick: (d: T) => void;
  useDelete: UseDelete<T>;
}) => {
  const entries = useMemo(() => Object.entries<ConfigItemType<T>>(tableConfig), [tableConfig]);

  const onEdit = useCallback((d: T) => () => onEditClick(d), [onEditClick]);

  return (
    <table className={clsx("mb-4", "w-full", "border-separate")}>
      <thead>
        <tr>
          {entries.map(([k, c]) => (
            <Fragment key={k}>{c.renderColHead()}</Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i}>
            {entries.map(([k, c]) => (
              <Fragment key={k}>{c.renderColCell(d)}</Fragment>
            ))}
            <td className="w-[1%]">
              <div className="flex gap-1">
                <IconButton variant="brand" as={PencilSquareIcon} onClick={onEdit(d)} />
                <DeleteAction d={d} useDelete={useDelete} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
