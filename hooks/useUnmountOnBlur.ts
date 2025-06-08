import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export const useUnmountOnBlur = () => {
  const [isMounted, setIsMounted] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsMounted(false);
      return () => {
        setIsMounted(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  return isMounted;
};
