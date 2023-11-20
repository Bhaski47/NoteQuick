import React, { useEffect, useState } from "react";
import styles from "./access.module.scss";
import Top from "../Container/Top/Top";
import Auth from "../../Auth/Auth";
function Access() {
  const [log, setLog] = useState(true);
  useEffect(() => {
    document.title = log ? "Log In | Flecx" : "Sign In | Flecx";
  }, [log]);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  const reset=()=>{
    setEmail('');
    setName('');
    setPass('');
  }
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await Auth.signIn({ name, email, pass });
      console.log(res);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await Auth.logIn({ email, pass });
      console.log(res);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  const login = () => (
    <div className={styles.box}>
      <div className={styles.leftSide}>
        <h1 className={styles.title}>Flecx</h1>
        <h4 className={styles.content}>A Platform For Creating ToDo List</h4>
      </div>
      <div onSubmit={handleLogin} className={styles.rightSide}>
        <h1>Log In</h1>
        <form method="POST">
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <br />
          <input
            className={styles.inputBox}
            type="text"
            name=""
            id="username"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <br />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <br />
          <input
            className={styles.inputBox}
            type="password"
            id="pass"
            onChange={(e) => {
              setPass(e.target.value);
            }}
            required
          />
          <br />
          <button onSubmit={handleLogin} className={styles.button} >Submit</button>
          <p
            className={styles.acc}
            onClick={() => {
              setLog(prev=>!prev);
              reset();
            }}
          >
            Don't Have An Account??
          </p>
        </form>
        <div></div>
      </div>
    </div>
  );

  const signin = () => (
    <div className={styles.box}>
      <div className={log ? styles.leftSide : styles.rightSide}>
        <h1>Sign In</h1>
        <form onSubmit={handleSignin} method="POST">
          <label className={styles.label} htmlFor="Name">
            Name
          </label>
          <br />
          <input
            className={styles.inputBox}
            type="text"
            id="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <br />
          <label className={styles.label} htmlFor="Email">
            Email
          </label>
          <br />
          <input
            className={styles.inputBox}
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <br />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <br />
          <input
            className={styles.inputBox}
            type="password"
            id="pass"
            onChange={(e) => {
              setPass(e.target.value);
            }}
            required
          />
          <br />
          {/* <input type="submit" className={styles.button} value="Submit" /> */}
          <button onClick={handleLogin} className={styles.button}>Submit</button>
          <p
            className={styles.acc}
            onClick={() => {
              setLog((prev) => !prev);
              reset();
            }}
          >
            Already Have An Account??
          </p>
        </form>
      </div>
      <div className={log ? styles.rightSide : styles.leftSide}>
        <h1 className={styles.title}>Flecx</h1>
        <h4 className={styles.content}>A Platform For Creating ToDo</h4>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className={styles.container}>
        <Top />
        {log && login()}
        {!log && signin()}
      </div>
    </React.Fragment>
  );
}

export default Access;
