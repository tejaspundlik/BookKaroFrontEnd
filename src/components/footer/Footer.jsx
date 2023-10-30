import "./footer.css";
import {FaGithub, FaTwitter, FaLinkedin} from 'react-icons/fa';


const Footer = () => {
  return (
    <div className="footer">
      <div className="footericons">
        <a href="https://github.com/ornefacciola"><FaGithub className="footerIcon" /></a> 
        <a href="https://twitter.com/orne_dev"><FaTwitter className="footerIcon" /></a>
        <a href="https://www.linkedin.com/in/ornella-facciola-a43219216/"><FaLinkedin className="footerIcon" /></a>
      </div>
      <div className="fText">Copyright © 2022 yourVoyage by Ornella.</div>
    </div>
  );
};

export default Footer;