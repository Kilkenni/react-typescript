import { useState } from "react";
import { FormEvent, ChangeEvent } from "react";
import { postBlogger } from "../../js/API";
import styles from "./AddBloggerForm.module.css";

import type { BloggerInfo } from "../BloggerEntry/BloggerEntry";
import useMountAnimation from "../../hooks/useMountAnimation";

const INIT_STATE = {
  name: "",
  URL: "",
  categories: "",
  subscribers: "",
  rating: "",
}

function AddBloggerForm({onSubmitted}: AddBloggerFormProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [blogger, setBlogger] = useState<{ name: string, URL: string, categories: string, subscribers: string, rating: string }>({ ...INIT_STATE });
  const hasTransitionedIn = useMountAnimation(isExpanded, 300);

  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }

  function onInputChange(event: ChangeEvent) {
        const { name, value } = event.currentTarget as HTMLFormElement;
        setBlogger({...blogger, [name]: value.toString() });
    };


  async function onAddBlogger(event: FormEvent) {
    event.preventDefault();

    const { name, URL, categories, subscribers, rating } = blogger;

    const response = await postBlogger({name, URL, categories:categories.split(","), subscribers: parseInt(subscribers), rating: parseFloat(rating)});
    
    if (response.status === 201) { //successful!
      setIsExpanded(false);
      setBlogger({ ...INIT_STATE });
      onSubmitted(response.data);
      alert(`Success!`)
    }
    else {
      alert(`Error adding form, response status: ${response.status}`); //Negative responses from the backend can be processed here
    }
    
  }

  return (<>
    <button type="button" onClick={toggleExpand} className={styles.btnExpand}>{isExpanded? "Collapse" : "Expand"}</button>
    {(hasTransitionedIn || isExpanded) && <form action="sumbit" onSubmit={onAddBlogger} className={`${styles.form} ${hasTransitionedIn && styles.transitioned} ${isExpanded && styles.expanded}`}>
      <label className={styles.formLabel}>
        Name
        <input
          type="text"
          name="name"
          required
          onChange={onInputChange}
          value={blogger.name}
          className={styles.formInput}
        ></input>
      </label>
      <label className={styles.formLabel}>
        Link to Youtube channel
        <input
          type="url"
          name="URL"
          required
          onChange={onInputChange}
          value={blogger.URL}
          className={styles.formInput}
        ></input>
      </label>
      <label className={styles.formLabel}>
        Categories
        <input
          type="text"
          name="categories"
          required
          onChange={onInputChange}
          value={blogger.categories}
          className={styles.formInput}
        ></input>
      </label>
      <label className={styles.formLabel}>
        Number of subscribers
        <input
          type="number"
          name="subscribers"
          min={0}
          max={1000000000}
          step={1}
          required
          onChange={onInputChange}
          value={blogger.subscribers}
          className={styles.formInput}
        ></input>
      </label>
      <label className={styles.formLabel}>
        Rating
        <input
          type="number"
          name="rating"
          min={0}
          max={5.0}
          step={0.1}
          required
          onChange={onInputChange}
          value={blogger.rating}
          className={styles.formInput}
        ></input>
      </label>
      <button type="submit" className={styles.formBtnSubmit}>Add blogger</button>
    </form>}
  </>);
}

export type AddBloggerFormProps = {
  onSubmitted: (newBlogger: {id: number } & BloggerInfo)=> void,
}

export default AddBloggerForm;