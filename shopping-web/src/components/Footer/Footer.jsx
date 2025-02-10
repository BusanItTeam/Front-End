import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    //Footer
    <div className="footer">
      <div className="frame">
        <div className="under-line"></div>
        <div className="frame-wrapper">
          <div className="div">
            <img className="icon-copyright" src="img/icon-copyright.svg" />
            <p className="text-wrapper">
              Copyright Rimel 2022. All right reserved
            </p>
          </div>
        </div>
      </div>
      <div className="frame-2">
        <div className="frame-3">
          <div className="frame-4">
            <div className="frame-4">
              <div className="logo">
                <div className="text-wrapper-2">Exclusive</div>
              </div>
              <div className="text-wrapper-3">Subscribe</div>
            </div>
            <p className="text-wrapper-4">Get 10% off your first order</p>
          </div>
          <div className="send-mail">
            <div className="text-wrapper-5">Enter your email</div>
            <img className="img" src="img/icon-send.svg" />
          </div>
        </div>
        <div className="frame-4">
          <div className="text-wrapper-6">Support</div>
          <div className="frame-3">
            <p className="element-bijoy-sarani">
              111 Bijoy sarani, Dhaka,&nbsp;&nbsp;DH 1515, Bangladesh.
            </p>
            <div className="text-wrapper-4">exclusive@gmail.com</div>
            <div className="text-wrapper-4">+88015-88888-9999</div>
          </div>
        </div>
        <div className="frame-4">
          <div className="text-wrapper-6">Account</div>
          <div className="frame-3">
            <div className="text-wrapper-7">My Account</div>
            <div className="text-wrapper-4">Login / Register</div>
            <div className="text-wrapper-4">Cart</div>
            <div className="text-wrapper-4">Wishlist</div>
            <div className="text-wrapper-4">Shop</div>
          </div>
        </div>
        <div className="frame-4">
          <div className="text-wrapper-6">Quick Link</div>
          <div className="frame-3">
            <div className="text-wrapper-7">Privacy Policy</div>
            <div className="text-wrapper-4">Terms Of Use</div>
            <div className="text-wrapper-4">FAQ</div>
            <div className="text-wrapper-4">Contact</div>
          </div>
        </div>
      </div>
    </div>

    //Frame643
  );
};

export default Footer;
