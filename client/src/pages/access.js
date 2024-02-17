import React, { useEffect, useState } from "react";
import styles from "../styles/access.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../utils/Loader";

function Login() {
  const nav = useNavigate();
  const [username, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setLogin] = useState(true);
  const [isLoad, setLoad] = useState(false);
  useEffect(() => {
    isLogin
      ? (document.title = "Register | Todo")
      : (document.title = "Login | Todo");
  }, [isLogin]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoad(true)
    try {
      const token = await axios.post(
        "https://backendtodo-s91r.onrender.com/auth/log",
        {
          pass: pass,
          email: email,
        }
      );
      const tok = token.data.data;
      localStorage.setItem("myTok", tok);
      localStorage.setItem("email", email);
      setLoad(false)
      successToast("Logging In");
      nav("/todo");
    } catch (err) {
      setLoad(false)
      errorToast(err.response.data.message);
    }
  };
  const handleSign = async (e) => {
    e.preventDefault();
    setLoad(true)
    const data = {
      name: username,
      email: email,
      pass: pass,
    };
    try {
      const token = await axios.post(
        "https://backendtodo-s91r.onrender.com/auth/create",
        data
      );
      successToast(token.data.message);
      setLoad(false)
    } catch (err) {
      setLoad(false)
      errorToast(err.response.data.message);
    }
  };

  const noAcc = () => {
    return (
      <p
        className={styles.accessChange}
        onClick={() => {
          setLogin((prev) => !prev);
        }}
      >
        Don't Have an Account??
      </p>
    );
  };
  const existAcc = () => {
    return (
      <p
        className={styles.accessChange}
        onClick={() => {
          setLogin((prev) => !prev);
        }}
      >
        Already Have an Account??
      </p>
    );
  };

  const errorToast = (value) => toast.error(value);
  const successToast = (value) => toast.success(value);

  return (
    <div className={styles.centerBox}>
      <Toaster />
      <div className={styles.content}>
        {isLoad && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}

        {!isLoad &&
          (isLogin ? (
            <h2 className={styles.header}>Register</h2>
          ) : (
            <h2 className={styles.header}>Login</h2>
          ))}
        {!isLoad && (
          <form
            onSubmit={isLogin ? handleSign : handleLogin}
            className={styles.form}
          >
            {isLogin && (
              <div className={styles.changeUser}>
                <label className={styles.label} htmlFor="Username">
                  Username
                </label>
                <br />
                <input
                  className={styles.input}
                  onChange={(e) => setUser(e.target.value)}
                  type="text"
                  required
                />
              </div>
            )}
            <label className={styles.label} htmlFor="Email">
              Email
            </label>
            <br />
            <input
              className={styles.input}
              type="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label className={styles.label} htmlFor="Password">
              Password
            </label>
            <br />
            <input
              className={styles.input}
              type="password"
              required
              autoComplete="off"
              onChange={(e) => setPass(e.target.value)}
            />
            <br />
            <button type="submit" className={styles.btn} autoComplete="off">
              Submit
            </button>
          </form>
        )}
        {!isLoad && (isLogin ? existAcc() : noAcc())}
      </div>
    </div>
  );
}

export default Login;
