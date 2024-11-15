/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import * as s from "./style";

interface RootLayoutProps {
  children : ReactNode;
}

function RootLayout({children} : RootLayoutProps) {
  return (
    <>
     <div css={s.background}></div> 
     <div css={s.layout}>
      {children}
      </div> 
    </>
  )
}

export default RootLayout