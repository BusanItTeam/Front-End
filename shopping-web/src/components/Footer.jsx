import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div class="footer">
      <div class="frame">
        <div class="under-line"></div>
        <div class="frame-wrapper">
          <div class="div">
            <img class="icon-copyright" src="/copyright.png" />
            <p class="text-wrapper">Copyright Rimel 2025. All right reserved</p>
          </div>
        </div>
      </div>

      <div class="frame-2">
        <div class="frame-3">
          <div class="frame-4">
            <div class="frame-4">
              <div class="logo">
                <div class="text-wrapper-2">Exclusive</div>
              </div>
              <div class="text-wrapper-3">Subscribe</div>
            </div>
            <p class="text-wrapper-4">Get 10% off your first order</p>
          </div>
          <div class="send-mail">
            <div class="text-wrapper-5">Enter your email</div>
            <img class="img" src="/send.png" />
          </div>
        </div>

        <div class="frame-4">
          <div class="text-wrapper-6">Support</div>
          <div class="frame-3">
            <p class="element-bijoy-sarani">
              111 Bijoy sarani, Dhaka,&nbsp;&nbsp;DH 1515, Korea.
            </p>
            <div class="text-wrapper-4">exclusive@gmail.com</div>
            <div class="text-wrapper-4">+88015-88888-9999</div>
          </div>
        </div>

        <div class="frame-4">
          <div class="text-wrapper-6">Account</div>
          <div class="frame-3">
            <a href="/mypage" class="text-wrapper-7">
              My Page
            </a>
            <a href="/login" class="text-wrapper-4">
              Login
            </a>
            <a href="/signup" class="text-wrapper-4">
              Sign Up
            </a>
            <a href="/cart" class="text-wrapper-4">
              Cart
            </a>
            <a href="/wishlist" class="text-wrapper-4">
              Wishlist
            </a>
          </div>
        </div>

        <div class="frame-4">
          <div class="text-wrapper-6">Quick Link</div>
          <div class="frame-3">
            <div class="text-wrapper-7">Privacy Policy</div>
            <div class="text-wrapper-4">Terms Of Use</div>
            <a href="/faq" class="text-wrapper-4">
              FAQ
            </a>
            <a href="/contact" class="text-wrapper-4">
              Contact
            </a>
          </div>
        </div>

        <div class="frame-4">
          <div class="frame-4">
            <div class="text-wrapper-6">Download App</div>
            <div class="frame-5">
              <p class="p">Save $3 with App New User Only</p>
              <div class="frame-6">
                <div class="qr-code">
                  <img class="qrcode" src="/QRcode.png" />
                </div>
                <div class="frame-7">
                  <img class="google-play" src="/google.png" />
                  <div class="app-store">
                    <img class="download-appstore" src="/appstore.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="frame-8">
            <img class="img" src="/facebook.png" />
            <img class="img" src="/twitter.png" />
            <img class="img" src="/instagram.png" />
            <img class="img" src="/linkedin.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
