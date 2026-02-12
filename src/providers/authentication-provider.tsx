import type { PropsWithChildren } from "react";
import { useCallback, useState } from "react";

import { useLogin } from "src/hooks/api/use-login";
import type { AccessLevel } from "src/routing/router.type";

type ExtensionProperties = PropsWithChildren<{ accessLevel: AccessLevel }>;
const AuthenticationProvider = ({ children, accessLevel }: ExtensionProperties) => {
  const [signed, setSigned] = useState(false);
  const [pwd, setPwd] = useState("");
  const onPwdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.currentTarget.value);
  }, []);

  const { mutateAsync } = useLogin();

  const onPwdCheck = useCallback(async () => {
    try {
      await mutateAsync({ pwd });
      setSigned(true);
    } catch {
      alert("incorrect password");
    }
  }, [mutateAsync, pwd]);

  if (signed || accessLevel === "") return <>{children}</>;

  return (
    <div className="mt-8 flex gap-4">
      <input
        type="password"
        placeholder="password"
        value={pwd}
        onChange={onPwdChange}
        className="border-2 border-brand-600 p-2"
      />
      <button onClick={onPwdCheck} className="border-2 bg-brand-600 p-2 text-white">
        submit
      </button>
    </div>
  );
};

export default AuthenticationProvider;
