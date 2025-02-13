import React from "react";
import "./MyPage.css";

const MyPage = () => {
  return (
    <div class="account">
      <div class="div">
        <p class="welcome-md-rimel">
          <span class="span">Welcome! </span> <span class="text-wrapper-7">Md Rimel</span>
        </p>

        <div class="text-wrapper-8">Manage My Account</div>
        <div class="text-wrapper-9">My Orders</div>
        <div class="text-wrapper-10">My WishList</div>
        <div class="frame-9">
          <div class="text-wrapper-11">My Profile</div>
          <div class="text-wrapper-12">Address Book</div>
          <div class="text-wrapper-12">My Payment Options</div>
        </div>
        <div class="frame-10">
          <div class="text-wrapper-13">My Returns</div>
          <div class="text-wrapper-12">My Cancellations</div>
        </div>
        <div class="frame-11">
          <div class="text-wrapper-14">Edit Your Profile</div>
          <div class="frame-12">
            <div class="frame-13">
              <div class="text-wrapper-15">First Name</div>
              <div class="placebox-info">
                <div class="text-wrapper-16">Md</div>
              </div>
            </div>
            <div class="frame-13">
              <div class="text-wrapper-15">Last Name</div>
              <div class="placebox-info">
                <div class="text-wrapper-16">Rimel</div>
              </div>
            </div>
          </div>
          <div class="frame-14">
            <div class="frame-13">
              <div class="text-wrapper-15">Email</div>
              <div class="placebox-info">
                <div class="md">rimel1111@gmail.com</div>
              </div>
            </div>
            <div class="frame-13">
              <div class="text-wrapper-15">Address</div>
              <div class="placebox-info">
                <div class="text-wrapper-16">Kingston, 5236, United State</div>
              </div>
            </div>
          </div>
          <div class="frame-15">
            <div class="frame-13">
              <div class="text-wrapper-15">Password Changes</div>
              <div class="md-wrapper">
                <div class="text-wrapper-16">Current Passwod</div>
              </div>
            </div>
            <div class="md-wrapper">
              <div class="text-wrapper-16">New Passwod</div>
            </div>
            <div class="md-wrapper">
              <div class="text-wrapper-16">Confirm New Passwod</div>
            </div>
          </div>
          <div class="frame-16">
            <div class="text-wrapper-17">Cancel</div>
            <button class="button">
              <div class="view-all-products">Save Changes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyPage;
