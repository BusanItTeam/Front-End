import React from "react";

function EditProfile() {
  return (
    <div class="account">
      <div class="div">
        <h1>회원 정보 수정</h1>

        <div class="text-wrapper-8">
          <div>회원 정보 수정</div>
          <div>주문내역 조회</div>
          <div>적립금 내역</div>
          <div>나의 위시리스트</div>
          <div>1:1 문의</div>
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
}

export default EditProfile;
