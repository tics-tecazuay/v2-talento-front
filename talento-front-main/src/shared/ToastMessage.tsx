import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { IMessage } from "../interfaces/Secondary/IMessage";

const ToastMessage = ({ message }: { message: IMessage | null }) => {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (message) {
      toast.current?.show(message);
    }
  }, [message]);

  return <Toast ref={toast} />;
};

export default ToastMessage;
