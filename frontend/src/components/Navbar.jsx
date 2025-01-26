import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="flex justify-between">
      <h1>Navbar</h1>
      <button onClick={() => logout()}>
        {" "}
        {authUser && <LogOut tooltip="Logout" />}{" "}
      </button>
    </div>
  );
};

export default Navbar;
