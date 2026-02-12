import { useCallback, useState } from "react";

import { Alert } from "src/components/alert";
import { Card } from "src/components/card";
import { Input, Select } from "src/components/input";
import { Spinner } from "src/components/spinner";
import type { SystemConfigType } from "src/hooks/api";
import { useCreateSystemConfig, useDeleteSystemConfig, useSystemConfig, useUpdateSystemConfig } from "src/hooks/api";

import { ColCell } from "./common/col-cell";
import { ColHeader } from "./common/col-header";
import { ConfigModal } from "./common/config-modal";
import { ConfigTable } from "./common/config-table";
import { CreateConfig } from "./common/create-config";
import { ItemBordered } from "./common/item-bordered";
import type { ConfigType } from "./common/settings-config.types";

export const tableConfig: ConfigType<SystemConfigType> = {
  key: {
    renderColHead: () => <ColHeader>Key</ColHeader>,
    renderColCell: (d) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.key}</ItemBordered>
      </ColCell>
    ),
    value: (d) => d?.key ?? "",
    renderInput: (k, c, d, isCreate, onChange) => (
      <Input
        label="Key"
        disabled={!isCreate}
        type="text"
        value={c.value(d) as string}
        name={k}
        onChange={onChange}
        placeholder="Key"
      />
    ),
  },
  value: {
    mobileHidden: true,
    value: (d?: SystemConfigType) => d?.value ?? "",
    renderColHead: () => <ColHeader>Value</ColHeader>,
    renderColCell: (d: SystemConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.key.includes("enabled") ? (d.value === "1" ? "Enabled" : "Disabled") : d.value}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => {
      return d.key.includes("enabled") ? (
        <Select
          name={k}
          onChange={onChange}
          defaultValue={c.value(d) as string}
          label="Enabled"
          options={[
            { label: "Enabled", value: "1" },
            { label: "Disabled", value: "0" },
          ]}
        />
      ) : (
        <Input
          label="Value"
          type="text"
          value={c.value(d) as string}
          name={k}
          onChange={onChange}
          placeholder="Value"
        />
      );
    },
  },
};

export const SystemConfigFragment = () => {
  const { data = [], isPending, isError } = useSystemConfig();
  const [editData, setEditData] = useState<SystemConfigType>();

  const toggleEditData = useCallback((d?: SystemConfigType) => setEditData(d), []);

  return (
    <Card header="System Config">
      {isError && <Alert>An error occured when retrieving the System Config.</Alert>}
      {isPending ? (
        <Spinner className="mx-auto my-4" />
      ) : (
        <>
          {!!editData && (
            <ConfigModal
              useCreateConfig={useCreateSystemConfig}
              useUpdateConfig={useUpdateSystemConfig}
              data={editData}
              isOpen
              toggleIsOpen={toggleEditData}
              config={tableConfig}
            />
          )}
          <ConfigTable
            useDelete={useDeleteSystemConfig}
            tableConfig={tableConfig}
            data={data}
            onEditClick={toggleEditData}
          />
          <CreateConfig
            config={tableConfig}
            useCreateConfig={useCreateSystemConfig}
            useUpdateConfig={useUpdateSystemConfig}
          />
        </>
      )}
    </Card>
  );
};
