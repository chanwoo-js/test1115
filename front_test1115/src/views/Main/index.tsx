import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
export default function Main() {

  const naviagte = useNavigate();
  const handleNavigateToBoard = () => {
    naviagte("/board");
  }
  return (
    <div>
      <button onClick={handleNavigateToBoard}>게시판 이동</button>
    </div>
  )
}