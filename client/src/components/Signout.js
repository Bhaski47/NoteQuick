// SignoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/button.module.scss'

const Signout = () => {
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.removeItem("myTok");
    localStorage.removeItem("email");
    navigate("/");
  };
  return (
    <button className={styles.button} onClick={handleSignout}>
      Sign out
    </button>
  );
};

export default Signout;
