import { useState, createContext } from 'react';

export type StoreContextState = {
  token: string;
  addToken: (data: string) => void;
};

const contextDefaultValues: StoreContextState = {
  token: '',
  addToken: () => undefined,
};

export const StoreStateContext =
  createContext<StoreContextState>(contextDefaultValues);

export const StoreProvider = ({ children }: any) => {
  const [token, setToken] = useState<string>(contextDefaultValues.token);
  const addToken = (newData: string) => setToken(newData);

  return (
    <StoreStateContext.Provider
      value={{
        token,
        addToken,
      }}
    >
      {children}
    </StoreStateContext.Provider>
  );
};
