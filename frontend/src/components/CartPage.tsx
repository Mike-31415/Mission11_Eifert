import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

function CartPage() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/";

  const freeShippingThreshold = 50;
  const progressPercent = Math.min(
    (totalPrice / freeShippingThreshold) * 100,
    100
  );
  const remaining = freeShippingThreshold - totalPrice;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="mb-4">🛒 Your Cart</h1>

          {/* Free Shipping Progress Bar */}
          <div className="mb-4">
            {totalPrice >= freeShippingThreshold ? (
              <div className="alert alert-success py-2">
                🎉 You qualify for free shipping!
              </div>
            ) : (
              <p className="mb-1 text-muted">
                Spend <strong>${remaining.toFixed(2)}</strong> more for free
                shipping
              </p>
            )}
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progressPercent.toFixed(0)}%
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
          ) : (
            <>
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.book.bookID}>
                          <td>{item.book.title}</td>
                          <td>${item.book.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeFromCart(item.book.bookID)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-end fw-bold">
                          Total:
                        </td>
                        <td colSpan={2} className="fw-bold">
                          ${totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="row">
                {/* Accordion Order Summary */}
                <div className="col-md-8">
                  <div className="accordion mb-3" id="orderSummaryAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#orderSummaryCollapse"
                          aria-expanded="false"
                          aria-controls="orderSummaryCollapse"
                        >
                          📋 Order Summary (
                          {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                          items)
                        </button>
                      </h2>
                      <div
                        id="orderSummaryCollapse"
                        className="accordion-collapse collapse"
                        data-bs-parent="#orderSummaryAccordion"
                      >
                        <div className="accordion-body">
                          <ul className="list-group list-group-flush">
                            {cart.map((item) => (
                              <li
                                key={item.book.bookID}
                                className="list-group-item d-flex justify-content-between"
                              >
                                <span>
                                  {item.book.title} x{item.quantity}
                                </span>
                                <span>
                                  $
                                  {(item.book.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-between fw-bold">
                              <span>Total</span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Cart Button */}
                <div className="col-md-4 d-flex align-items-start justify-content-end">
                  <button className="btn btn-danger" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Always visible */}
          <div className="row mt-3">
            <div className="col-12">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(returnTo)}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
