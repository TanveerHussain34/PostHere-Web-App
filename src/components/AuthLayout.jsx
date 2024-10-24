import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth?.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);
  return loader ? (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-300 to-gray-700">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
      <h1 className="text-3xl text-white font-bold">Loading...</h1>
    </div>
  ) : (
    <>{children}</>
  );
}

Protected.propTypes = {
  children: PropTypes.node.isRequired, // 'children' should be a valid React node
  authentication: PropTypes.bool, // 'authentication' is a boolean
};
