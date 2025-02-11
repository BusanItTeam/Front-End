import "./Login.css";

const Login = () => {
  return (
    <div class="log-in">
      <div class="div">
        <div class="frame-7">
          <div class="side-image">
            <img class="dl-beatsnoop" src="dl.beatsnoop.png" />
          </div>
          <form class="frame-8">
            <div class="frame-9">
              <div class="frame-10">
                <div class="text-wrapper-6">로그인 페이지</div>
                <div class="text-wrapper-7">이메일과 비밀번호를 입력해주세요</div>
              </div>
              <div class="frame-8">
                <div class="frame-11">
                  <input className="text-wrapper-8" placeholder="E-mail" />
                  <div class="under-line"></div>
                </div>
                <div class="frame-11">
                  <input className="text-wrapper-8" placeholder="Password" />
                  <div class="under-line-2"></div>
                </div>
              </div>
            </div>
            <div class="frame-12">
              <div class="frame-13">
                <button type="submit" class="button">
                  <div class="view-all-products">로그인</div>
                </button>
              </div>
              <a href="/" class="text-wrapper-9">
                비밀번호 찾기
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
