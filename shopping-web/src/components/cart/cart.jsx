import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  return (
    <div className="cart">
      <div className="div">
        <div className="line"></div>
        <div className="frame-9">
          <div className="frame-10">
            <div className="frame-11">
              <div className="cart-main-section">
                <div className="frame-12">
                  <div className="text-wrapper-7">Product</div>
                  <div className="text-wrapper-7">Price</div>
                  <div className="text-wrapper-7">Quantity</div>
                  <div className="text-wrapper-7">Subtotal</div>
                </div>
              </div>
              <div className="cart-section">
                <div className="text-wrapper-8">$650</div>
                <div className="text-wrapper-9">$650</div>
                <div className="quantity">
                  <div className="frame-13">
                    <div className="text-wrapper-10">01</div>
                    <div className="frame-14">
                      <img className="img-2" src="/dropup.png" alt="Increase" />
                      <img
                        className="img-2"
                        src="/dropdownsmall.png"
                        alt="Decrease"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-wrapper-11">LCD Monitor</div>
              </div>
              <div className="cart-section">
                <div className="text-wrapper-8">$550</div>
                <div className="text-wrapper-9">$1100</div>
                <div className="quantity">
                  <div className="frame-15">
                    <div className="text-wrapper-10">02</div>
                    <div className="frame-14">
                      <img className="img-2" src="/dropup.png" alt="Increase" />
                      <img
                        className="img-2"
                        src="/dropdownsmall.png"
                        alt="Decrease"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-wrapper-11">H1 Gamepad</div>
              </div>
            </div>
            <div className="frame-16">
              <button className="button">
                <div className="view-all-products">Return To Shop</div>
              </button>
              <button className="button">
                <div className="view-all-products">Update Cart</div>
              </button>
            </div>
          </div>
          <div className="frame-17">
            <div className="frame-18">
              <div className="frame-19">
                <div className="text-wrapper-12">Coupon Code</div>
              </div>
              <button className="view-all-products-wrapper">
                <div className="view-all-products-2">Apply Coupon</div>
              </button>
            </div>
            <div className="frame-20">
              <div className="text-wrapper-13">Cart Total</div>
              <div className="frame-21">
                <div className="text-wrapper-7">Subtotal:</div>
                <div className="text-wrapper-7">$1750</div>
              </div>
              <div className="frame-22">
                <div className="text-wrapper-7">Shipping:</div>
                <div className="text-wrapper-7">Free</div>
              </div>
              <div className="frame-23">
                <div className="text-wrapper-7">Total:</div>
                <div className="text-wrapper-7">$1750</div>
              </div>
              <button className="button-2">
                <div className="view-all-products-2">Proceed to Checkout</div>
              </button>
              <div className="under-line"></div>
              <div className="under-line-2"></div>
            </div>
          </div>
        </div>

        <div className="roadmap">
          <Link to="/" className="account">
            Home
          </Link>
          <img className="line-2" src="line13.png" alt="Separator" />
          <Link to="/cart" className="nothing">
            Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
