import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const useQueryParamNotification = (paramName, message) => {
  const location = useLocation();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get(paramName) === "true" && !hasShown) {
      toast.success(message);
      setHasShown(true);
    }
  }, [location, hasShown, paramName, message]);
};

export default useQueryParamNotification;
