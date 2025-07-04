import { useEffect, useState } from "react";

export const useRefetchDebounce = (ms: number) => {
  const [canRefetch, setCanRefetch] = useState<boolean>(true);
  const [lastlyFetched, setLastlyFetched] = useState<number>(0);

  const restart = () => {
    setLastlyFetched(0);
    setCanRefetch(true);
  };

  const refetch = () => {
    if (canRefetch) {
      setLastlyFetched(Date.now());
      setCanRefetch(false);
    }
  };

  useEffect(() => {
    let interval: number;
    if (!canRefetch) {
      interval = setInterval(() => {
        if (Date.now() - lastlyFetched > ms) {
          setCanRefetch(true);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [canRefetch]);

  return { refetch, canRefetch, restart };
};
