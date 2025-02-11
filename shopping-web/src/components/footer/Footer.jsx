import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="frame">
        <div className="under-line"></div>
        <div className="frame-wrapper">
          <div className="div">
            <img className="icon-copyright" src="/copyright.png" />
            <p className="text-wrapper">
              Copyright Rimel 2025. All right reserved
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
            <img className="img" src="/send.png" />
          </div>
        </div>

        <div className="frame-4">
          <div className="text-wrapper-6">Support</div>
          <div className="frame-3">
            <p className="element-bijoy-sarani">
              111 Bijoy sarani, Dhaka,&nbsp;&nbsp;DH 1515, Korea.
            </p>
            <div className="text-wrapper-4">exclusive@gmail.com</div>
            <div className="text-wrapper-4">+88015-88888-9999</div>
          </div>
        </div>

        <div className="frame-4">
          <div className="text-wrapper-6">Account</div>
          <div className="frame-3">
            <a href="/mypage" className="text-wrapper-7">
              My Page
            </a>
            <a href="/login" className="text-wrapper-4">
              Login
            </a>
            <a href="/signup" className="text-wrapper-4">
              Sign Up
            </a>
            <a href="/cart" className="text-wrapper-4">
              Cart
            </a>
            <a href="/wishlist" className="text-wrapper-4">
              Wishlist
            </a>
          </div>
        </div>

        <div className="frame-4">
          <div className="text-wrapper-6">Quick Link</div>
          <div className="frame-3">
            <div className="text-wrapper-7">Privacy Policy</div>
            <div className="text-wrapper-4">Terms Of Use</div>
            <a href="/faq" className="text-wrapper-4">
              FAQ
            </a>
            <a href="/contact" className="text-wrapper-4">
              Contact
            </a>
          </div>
        </div>

        <div className="frame-4">
          <div className="frame-4">
            <div className="text-wrapper-6">Download App</div>
            <div className="frame-5">
              <p className="p">Save $3 with App New User Only</p>
              <div className="frame-6">
                <div className="qr-code">
                  <img className="qrcode" src="/QRcode.png" />
                </div>
                <div className="frame-7">
                  <img className="google-play" src="/google.png" />
                  <div className="app-store">
                    <img className="download-appstore" src="/appstore.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="frame-8">
            <img className="img" src="/facebook.png" />
            <img className="img" src="/twitter.png" />
            <img className="img" src="/instagram.png" />
            <img className="img" src="/linkedin.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
