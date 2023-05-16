import React from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, Slide } from 'react-toastify';
const Toast = () => {
  return (
    <>
      <ToastContainer
        className='impct-toast'
        position='top-center'
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
    </>
  );
};

export default Toast;
