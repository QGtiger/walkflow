import { AuthLoginLayout } from "@/Layouts/AuthLogin";
import { useOutlet } from "react-router-dom";

export default () => {
  const outlet = useOutlet();

  return <AuthLoginLayout>{outlet}</AuthLoginLayout>;
};
