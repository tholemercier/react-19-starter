import { useCallback, useState } from "react";

import { Alert } from "src/components/alert";
import { Card } from "src/components/card";
import { Input, Select } from "src/components/input";
import { Spinner } from "src/components/spinner";
import {
  useCreateStrategyConfig,
  useDeleteStrategyConfig,
  useStrategyConfig,
  useUpdateStrategyConfig,
} from "src/hooks/api";
import type { StrategyConfigType } from "src/hooks/api";

import { ColCell } from "./common/col-cell";
import { ColHeader } from "./common/col-header";
import { ConfigModal } from "./common/config-modal";
import { ConfigTable } from "./common/config-table";
import { CreateConfig } from "./common/create-config";
import { ItemBordered } from "./common/item-bordered";
import type { ConfigType } from "./common/settings-config.types";

export const tableConfig: ConfigType<StrategyConfigType> = {
  strategy_key: {
    value: (d?: StrategyConfigType) => {
      return d?.strategy_key ?? "";
    },
    renderColHead: () => <ColHeader>Key</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.strategy_key}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Input
        label="Strategy Key"
        type="text"
        value={c.value(d) as string}
        name={k}
        onChange={onChange}
        placeholder="Strategy Key"
      />
    ),
  },
  platform: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => {
      return d?.platform ?? "";
    },
    renderColHead: () => <ColHeader>Platform</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.platform}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Select
        name={k}
        onChange={onChange}
        defaultValue={c.value(d) as string}
        label="Platform"
        options={[
          { label: "MT5", value: "MT5" },
          { label: "IR", value: "IR" },
          { label: "KRAKEN", value: "KRAKEN" },
          { label: "IB", value: "IB" },
        ]}
      />
    ),
  },
  broker_symbol: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => {
      return d?.broker_symbol ?? "";
    },
    renderColHead: () => <ColHeader>Broker Symbol</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.broker_symbol}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Input
        label="Broker Symbol"
        type="text"
        value={c.value(d) as string}
        name={k}
        onChange={onChange}
        placeholder="Broker Symbol"
      />
    ),
  },
  positioning: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => d?.positioning ?? "",
    renderColHead: () => <ColHeader>Positioning</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.positioning}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Select
        name={k}
        onChange={onChange}
        defaultValue={c.value(d) as string}
        label="Positioning"
        options={[
          { label: "Long", value: "long" },
          { label: "Short", value: "short" },
        ]}
      />
    ),
  },
  email_subject: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => {
      return d?.email_subject ?? "";
    },
    renderColHead: () => <ColHeader>Email Subject</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.email_subject}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Input
        label="Email Subject"
        type="text"
        value={c.value(d) as string}
        name={k}
        onChange={onChange}
        placeholder="Email Subject"
      />
    ),
  },
  volume: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => {
      return d?.volume ?? 0;
    },
    renderColHead: () => <ColHeader>Volume</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.volume}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
      <Input
        label="Volume"
        type="number"
        step={0.1}
        value={c.value(d) as number}
        name={k}
        onChange={onChange}
        placeholder="Volume"
      />
    ),
  },
  enabled: {
    mobileHidden: true,
    value: (d?: StrategyConfigType) => {
      return d?.enabled ?? "";
    },
    renderColHead: () => <ColHeader>Enabled</ColHeader>,
    renderColCell: (d: StrategyConfigType) => (
      <ColCell className="hidden md:table-cell">
        <ItemBordered>{d.enabled ? "Enabled" : "Disabled"}</ItemBordered>
      </ColCell>
    ),
    renderInput: (k, c, d, _isCreate, onChange) => (
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
    ),
  },
};

export const StrategyConfigFragment = () => {
  const { data = [], isPending, isError } = useStrategyConfig();
  const [editData, setEditData] = useState<StrategyConfigType>();

  const toggleEditData = useCallback((d?: StrategyConfigType) => setEditData(d), []);

  return (
    <Card header="Strategy Config">
      {isError && <Alert>An error occured when retrieving the Strategy Config.</Alert>}
      {isPending ? (
        <Spinner className="mx-auto my-4" />
      ) : (
        <>
          <ConfigModal
            useCreateConfig={useCreateStrategyConfig}
            useUpdateConfig={useUpdateStrategyConfig}
            data={editData}
            isOpen={!!editData}
            toggleIsOpen={toggleEditData}
            config={tableConfig}
          />
          <ConfigTable
            useDelete={useDeleteStrategyConfig}
            tableConfig={tableConfig}
            data={data}
            onEditClick={toggleEditData}
          />
          <CreateConfig
            config={tableConfig}
            useCreateConfig={useCreateStrategyConfig}
            useUpdateConfig={useUpdateStrategyConfig}
          />
        </>
      )}
    </Card>
  );
};
