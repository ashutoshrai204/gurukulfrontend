import React from 'react'
import "./footer.css"
import { FaFacebook  } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
        <p>  
          &copy; 2024 <span className="custom-fontt">Gurukul</span>.    All rights reserved. <br />  
          Made with ❤️ by <a href="https://github.com/ashutoshrai204">Ashutosh Rai</a>  
        </p> 
            <div className="social-links">
                <a href="https://www.linkedin.com/in/ashutosh-rai-407015220/"><FaLinkedin/></a>
                <a href="https://www.facebook.com/profile.php?id=100076450205988"><FaFacebook/></a>
                <a href="https://www.instagram.com/ashutoshrai204/"><FaInstagram/></a>
            </div>
        </div>
    </footer>
  );
}

export default Footer