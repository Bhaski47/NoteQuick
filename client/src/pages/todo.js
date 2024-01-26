import React, { useEffect, useState } from "react";
import styles from "../styles/todo.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Signout from "../components/Signout";

function ToDo() {
  const [note, setNote] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [item, setItem] = useState("");
  const [isAdd, setAdd] = useState(false);
  const [data, setData] = useState([]);
  const [fetchError, setFetcherr] = useState("");
  const [updateDetails, setupdateDetails] = useState("");
  const [refetch, setFetch] = useState(false);
  const [addmes, setAddmes] = useState(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    document.title = "Todo";
  }, []);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.post("https://backendtodo-s91r.onrender.com/get", {
          email: email,
        });
        if (email.trim() === "") {
          throw new Error("Email is empty ");
        }
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setFetcherr(error.message);
      }
    };
    getDetails();
  }, [email, refetch]);

  const handleEdit = (item) => {
    setNote(true);
    setupdateDetails(false);
    setItem(item);
    setTitle(item.title);
    setContent(item.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`https://backendtodo-s91r.onrender.com/update/${item._id}`, {
      title: title,
      content: content,
    });
    setupdateDetails(true);
    setFetch((prev) => !prev);
  };

  const handleAdd = () => {
    setAdd((prev) => !prev);
    setAddmes(false);
  };

  const addNote = async (e) => {
    e.preventDefault();
    if(title.length===0 || content.length===0) {
      return
    };
    const fetchInfo = await axios.post("https://backendtodo-s91r.onrender.com/insert", {
      email: email,
      title: title,
      content: content,
    });
    console.log(fetchInfo.data);
    setAddmes(true);
    setFetch((prev) => !prev);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`https://backendtodo-s91r.onrender.com/delete/${item._id}`, {
        email: email,
      });
      setFetch((prev) => !prev);
    } catch (error) {
      setFetcherr(error);
    }
  };

  return (
    <div>
      <div className={styles.button}>
        <Signout />
      </div>
      {!isAdd && !note && !fetchError && (
        <div className={styles.centerBox}>
          <AddCircleIcon
            fontSize="large"
            className={styles.iconColor}
            onClick={handleAdd}
          />
          {data.map((item, index) => (
            <div className={styles.card} key={index}>
              <div>
                <h2 className={styles.title}>Title: {item.title}</h2>
                <br />
                <p className={styles.content}>{item.content}</p>
              </div>
              <div className={styles.symbol}>
                <EditIcon onClick={() => handleEdit(item)} />
                <DeleteIcon onClick={() => handleDelete(item)} />
              </div>
            </div>
          ))}
        </div>
      )}
      {fetchError && <h2>{fetchError}</h2>}
      {isAdd && (
        <div className={styles.create}>
          <div className={styles.createBox}>
            <form onSubmit={addNote} className={styles.box}>
              <CloseIcon
                className={styles.close}
                onClick={() => setAdd((prev) => !prev)}
              />
              <label className={styles.label}>Add Title</label>
              <br />
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
              <br />
              <label className={styles.label}>Content</label>
              <br />
              <input
                type="text"
                onChange={(e) => setContent(e.target.value)}
                className={styles.input}
              />
              <br />
              {addmes === true ? <h4>Added Successfully</h4> : ""}
              <br />
              <button className={styles.buttons}>Add</button>
            </form>
          </div>
        </div>
      )}

      {note && (
        <div className={`${styles.create} ${styles.blurBackground}`}>
          <div className={styles.createBox}>
            <form onSubmit={handleSubmit} className={styles.box}>
              <CloseIcon
                className={styles.close}
                onClick={() => {
                  setNote(false);
                  setTitle("");
                  setContent("");
                }}
              />
              <label className={styles.label}>Edit Title</label>
              <br />
              <input
                type="text"
                placeholder={item.title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
              <br />
              <label className={styles.label}>Content</label>
              <br />
              <input
                type="text"
                placeholder={item.content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.input}
              />
              <br />
              {updateDetails === true ? <h4>Updated Successfully</h4> : ""}
              <br />
              <button className={styles.buttons}>Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDo;
