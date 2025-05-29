// // Logout.jsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Logout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     sessionStorage.clear();
//     setTimeout(() => {
//       navigate('/');
//     }, 100); // optional delay
//   }, [navigate]);

//   return <p className="text-center mt-5">Logging out...</p>;
// };

// export default Logout;
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    sessionStorage.clear();

    // 🔁 Force a full page reload to login/home
    window.location.href = '/';
  }, []);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
