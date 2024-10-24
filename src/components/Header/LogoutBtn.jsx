import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };
  return (
    <button
      onClick={logoutHandler}
      className="inline-block text-white font-semibold px-6 py-2 duration-200 hover:text-blue-800 hover:bg-gray-200 rounded-full"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
