import BloggerEntry from "../BloggerEntry";
// import json from "../../db.json";
import { useState, useEffect } from "react";
import axios from "axios";
import useInfiniteScroll from 'react-infinite-scroll-hook';

import type { BloggerEntryProps } from "../BloggerEntry/BloggerEntry";

function useLoadItems() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<( {id: number } & BloggerEntryProps )[]>([]);
  const [currentPage, setCurrentPage] = useState<number|undefined>(undefined);
  const [totalItems, setTotalItems] = useState<number|undefined>(undefined);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    //fetch once on component mount to get total number of entries
    async function doOnce() {
      const {status, headers } = await axios.get(`http://localhost:3000/bloggers?_page=1&_limit=1`);
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
      const { data: newData, status, headers } = await axios.get(`http://localhost:3000/bloggers?_page=${currentPage+1}&_limit=5`);
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

  return { loading, items, currentPage, totalItems, error, loadMore };
}

function BloggersTable() {
  // const [bloggers, setBloggers] = useState<( {id: number } & BloggerEntryProps )[]>([]);
  // const [page, setPage] = useState<number>(0);
  // const [totalBloggers, setTotalBloggers] = useState<number>(0);

  // useEffect(() => {
  //   //pull initial list from backend once
  //   async function getBloggers() {
  //     const response = await axios.get(`http://localhost:3000/bloggers?_page=0&_limit=5`);
  //     if (response.status === 200) {
  //       console.log(response.data);
  //       setBloggers(response.data);
  //       setTotalBloggers(parseInt(response.headers["x-total-count"] || "0"));
  //     }
  //   }

  //   getBloggers();
  // }, []);

  //switch page only when there is a next page - we assume here that limit is 5 per page (can be parametrized later)
  // function nextPage() {
  //   if (page * 5 < totalBloggers) {
  //     setPage(page + 1);
  //   }
  // }

  const { loading, items: bloggers, currentPage, totalItems, error, loadMore } = useLoadItems();

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
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    delayInMs: 2000,
    rootMargin: '0px 0px 200px 0px',
  });

  // async function loadMoreBloggers() {
  //   nextPage();
  //   const response = await axios.get(`http://localhost:3000/bloggers?_page=${page-1}&_limit=5`);
  //   if (response.status === 200) {
  //     console.log(response.data);
  //     setBloggers([...bloggers, ...response.data]);
  //   }
  // }

  return (<>
      <table>
        <tbody>
          {bloggers && bloggers.map(({id, name, URL, categories, subscribers, rating}) => {
            return (<BloggerEntry key={id} id={id} name={name} URL={URL} categories={categories} subscribers={subscribers} rating={rating} ></BloggerEntry>);
          })}
        </tbody>
      </table>
      <div ref={sentryRef} />
      {(loading || hasNextPage()) && (
        <div>
          Loading
        </div>
      )}
    </>);
} 

export default BloggersTable;