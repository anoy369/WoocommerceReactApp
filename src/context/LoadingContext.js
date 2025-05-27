import { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);

  const setpageLoading = (status) => {
    setLoader(status);
  };

  return (
    <LoadingContext.Provider value={{ loader, setpageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};