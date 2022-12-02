import styles from "./BloggerEntry.module.css";

function BloggerEntry({ id, name, URL, categories, subscribers, rating }: {id:number} & BloggerInfo) {
  return (
  <tr>
    <td className={styles.tableCell + " " + styles.tableCellNumber}>{id}</td>
    <td className={styles.tableCell + " " + styles.tableCellText}> <a href={URL} target="_blank" rel="noreferrer">{name}</a> </td>
    <td className={styles.tableCell + " " + styles.tableCellText}> {categories.join(", ")} </td>
    <td className={styles.tableCell + " " + styles.tableCellStats}> {subscribers}</td>
    <td className={styles.tableCell + " " + styles.tableCellStats}> {rating>0 ? rating : "no rating yet"} </td>
  </tr>);
}

export type BloggerInfo = {
  // id: number,
  name: string,
  URL: string,
  categories: string[],
  subscribers: number,  
  rating: number,
}

export default BloggerEntry;
