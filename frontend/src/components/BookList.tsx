import type { Book } from "../types/Book";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { addToCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  // Fetch categories once
  useEffect(() => {
    fetch("http://localhost:5068/api/books/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Fetch books when filters change
  useEffect(() => {
    const categoryParam = selectedCategory
      ? `&category=${encodeURIComponent(selectedCategory)}`
      : "";
    fetch(
      `http://localhost:5068/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalPages(data.totalPages);
      });
  }, [page, pageSize, sortOrder, selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    navigate("/cart", {
      state: {
        returnTo: `/?page=${page}&category=${selectedCategory}`,
      },
    });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar - Category Filter */}
        <div className="col-md-2">
          <h5 className="fw-bold">Categories</h5>
          <ul className="list-group">
            <li
              className={`list-group-item list-group-item-action ${selectedCategory === "" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryChange("")}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>📚 Bookstore</h1>

            {/* Cart Summary */}
            <div
              className="badge bg-success fs-6 p-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >
              🛒 {totalItems} items — ${totalPrice.toFixed(2)}
            </div>
          </div>

          {/* Controls */}
          <div className="d-flex gap-3 mb-3 align-items-center">
            <div>
              <label className="me-2 fw-bold">Sort by Title:</label>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  setPage(1);
                }}
              >
                Title {sortOrder === "asc" ? "▲" : "▼"}
              </button>
            </div>
            <div>
              <label className="me-2 fw-bold">Results per page:</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification/Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>
                    {book.classification} / {book.category}
                  </td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(book)}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default BookList;
