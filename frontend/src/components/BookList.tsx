import { useEffect, useState } from "react";
import type { Book } from "../types/Book.ts";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch(
      `http://localhost:5068/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalPages(data.totalPages);
      });
  }, [page, pageSize, sortOrder]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📚 Bookstore</h1>

      {/* Controls */}
      <div className="d-flex gap-3 mb-3 align-items-center">
        {/* Sort */}
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

        {/* Page size */}
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

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;
