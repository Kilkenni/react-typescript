import { useState, useEffect } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';

import BloggerEntry from "../BloggerEntry";
import type { BloggerInfo } from "../BloggerEntry/BloggerEntry";
import AddBloggerForm from "../AddBloggerForm/AddBloggerForm";
import { fetchBloggers } from "../../js/API";
import styles from "./BloggersTable.module.css";

function useLoadItems() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<( {id: number } & BloggerInfo )[]>([]);
  const [currentPage, setCurrentPage] = useState<number|undefined>(undefined);
  const [totalItems, setTotalItems] = useState<number|undefined>(undefined);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    //fetch once on component mount to get total number of entries
    async function doOnce() {
      const {status, headers } = await fetchBloggers(1, 1);
      if (status === 200) {
        setTotalItems(parseInt(headers["x-total-count"] || "0")); //JSON-server returns total num of entries as a header
        setCurrentPage(0);
      }
    }

    doOnce();
  },[]);

  async function loadMore() {
    if (currentPage === undefined || totalItems === undefined) {
      return;
    }

    setLoading(true);
    try {
      const { data: newData, status, headers } = await fetchBloggers(currentPage+1);
      if (status === 200) {
        setItems((current) => [...current, ...newData]);
        setTotalItems(parseInt(headers["x-total-count"] || "0")); //JSON-server returns total num of entries as a header
        setCurrentPage(currentPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err : undefined);
    } finally {
      setLoading(false);
    }
  }

  return { loading, items, setItems, currentPage, totalItems, setTotalItems, error, loadMore };
}

function BloggersTable() {
  const { loading, items: bloggers, setItems: setBloggers, currentPage, totalItems, setTotalItems, error, loadMore } = useLoadItems();

  function hasNextPage() {
    if (currentPage === undefined || totalItems === undefined) {
      return false;
    }
    return (currentPage * 5 < totalItems);
  }

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasNextPage(),
    onLoadMore: loadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    delayInMs: 500, //artifically slow down fetch to show its work
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 0px 0px',
  });

  function onBloggerInserted(newBlogger : {id: number } & BloggerInfo) {
    if (!totalItems) {
      setTotalItems(1);
      setBloggers([newBlogger]);
    }
    else {
      //if last page has space, add to it
      if (currentPage !== undefined) {
        if (bloggers.length < currentPage * 5) {
          setBloggers([...bloggers, newBlogger])
        }
      }
      setTotalItems(totalItems + 1);
    }
  }

  return (<>
      <AddBloggerForm onSubmitted={onBloggerInserted}/>
      <table className={styles.bloggers}>
        <caption className={styles.caption}>Youtube bloggers</caption>
        <thead>
        <tr>
          <th>ID</th>
          <th>Youtube channel</th>
          <th>Categories</th>
          <th>Subs</th>
          <th>Rating</th>
        </tr>
        </thead>
        <tbody>
          {bloggers && bloggers.map(({id, name, URL, categories, subscribers, rating}) => {
            return (<BloggerEntry key={id} id={id} name={name} URL={URL} categories={categories} subscribers={subscribers} rating={rating} ></BloggerEntry>);
          })}
        </tbody>
      </table>
      <div ref={sentryRef} />
      {(loading || hasNextPage()) && (
        <div>
          Loader placeholder
        </div>
      )}
    </>);
} 

export default BloggersTable;