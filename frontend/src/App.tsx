import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import BookList from "./components/BookList";
import CartPage from "./components/CartPage";
import AdminBooks from "./components/AdminBooks";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
