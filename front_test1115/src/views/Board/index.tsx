import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { useCookies } from "react-cookie";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [cookies] = useCookies(["token"]);
      // 저장된 토큰 가져오기

  const fetchPosts = async (page: number) => {
    const token = cookies.token;
    

    try {
      console.log(token)
      if(token){
      const response = await axios.get(
        `http://localhost:8080/api/v1/posts?page=${page}&size=5`, {
          headers : {
            authorization : `Bearer ${token}`,
          }
        }
      );
      
      const data = response.data.data;
      setPosts(data.content);
      setTotalPages(data.totalPages);
    }
    } catch (error) {
      console.error("post 데이터 받아오기 실패", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreSectionClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextSectionClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div>
      게시판 목록 화면
      <h2>게시판 목록</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <Pagination
        pageList={Array.from(Array(totalPages).keys())}
        currentPage={currentPage}
        handlePreSectionClick={handlePreSectionClick}
        handleNextSectionClick={handleNextSectionClick}
        handlePageClick={handlePageClick}
      />
    </div>
  );
}
