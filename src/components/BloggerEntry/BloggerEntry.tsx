function BloggerEntry({id, name, URL, categories, subscribers, rating}: BloggerEntryProps) {
  return (<tr>
    <td>{id} </td>
    <td> <a href={URL} target="_blank" rel="noreferrer">{name}</a> </td>
    <td> {categories.join(", ")} </td>
    <td> {subscribers}</td>
    <td> {rating>0 ? rating : "no rating yet"} </td>
  </tr>);
}

export type BloggerEntryProps = {
  id: number,
  name: string,
  URL: string,
  categories: string[],
  subscribers: number,  
  rating: number,
}

export default BloggerEntry;
