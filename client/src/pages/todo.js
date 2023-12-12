import React, { useState } from "react";
import styles from "../styles/todo.module.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";

const data = [
  {
    title: "hello",
    content: "welcome",
  },
  {
    title: "Vannakam",
    content: "suepr",
  },
];
function ToDo() {
  const [note, setNote] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function clear() {
    setTitle("");
    setContent("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    clear();
    console.log(title, content);
  };
  return (
    <div>
      <div className={styles.centerBox}>
        {!note && (
          <div className={styles.card}>
            <div>
              <h2 className={styles.title}>Title:{data[0].title}</h2>
              <br />
              <p className={styles.content}>{data[0].content}</p>
            </div>
            <div className={styles.symbol}>
              <AddCircleIcon onClick={() => setNote(true)} />
            </div>
          </div>
        )}
      </div>
      {note && (
        <div className={styles.create}>
          <div className={styles.createBox}>
            <form onSubmit={handleSubmit} className={styles.box}>
              <CloseIcon
                className={styles.close}
                onClick={() => setNote(false)}
              />
              <label className={styles.label}>Title</label>
              <br />
              <input type="text" onChange={(e) => setTitle(e.target.value)} className={styles.input} />
              <br />
              <label className={styles.label}>Content</label>
              <br />
              <input type="text" onChange={(e) => setContent(e.target.value)} className={styles.input} />
              <br />
              <button>Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDo;
