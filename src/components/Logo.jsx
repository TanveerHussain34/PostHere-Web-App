import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Logo({ width = "100px" }) {
  return (
    <Link to="/">
      <div
        className="flex items-center justify-center bg-gray-200 rounded-xl shadow-lg py-2"
        style={{ width }}
      >
        <h1 className="text-lg font-semibold text-blue-800">PostHere</h1>
      </div>
    </Link>
  );
}

Logo.propTypes = {
  width: PropTypes.string,
};

export default Logo;
