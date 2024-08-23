import React from 'react'
import "./home.css";
import { useNavigate } from 'react-router-dom';
import Testimonials from '../../components/testimonials/Testimonials';

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to <div className="custom-font">Gurukul</div>our modern day E-Learning platform</h1>
          <p>Learn, grow and excel</p>
          <button onClick={()=> navigate("/courses")} className='comman-btn'>Get Started</button>
        </div>
      </div>
      <Testimonials/>
    </div>
  );
}

export default Home