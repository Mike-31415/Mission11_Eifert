import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import API_BASE from "../config";

const emptyBook: Omit<Book, "bookID"> = {
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  classification: "",
  category: "",
  pageCount: 0,
  price: 0,
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, "bookID">>(emptyBook);

  const API = `${API_BASE}/books`;

  const fetchBooks = () => {
    fetch(`${API}?pageSize=1000`)
      .then((res) => res.json())
      .then((data) => setBooks(data.books));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setShowForm(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  const handleSubmit = async () => {
    if (editingBook) {
      await fetch(`${API}/${editingBook.bookID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, bookID: editingBook.bookID }),
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setShowForm(false);
    fetchBooks();
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-11">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>⚙️ Admin — Manage Books</h1>
            <button className="btn btn-success" onClick={handleAdd}>
              + Add Book
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header fw-bold">
                {editingBook ? "Edit Book" : "Add New Book"}
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {(
                    [
                      "title",
                      "author",
                      "publisher",
                      "isbn",
                      "classification",
                      "category",
                    ] as const
                  ).map((field) => (
                    <div className="col-md-4" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>
                      <input
                        className="form-control"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                  <div className="col-md-4">
                    <label className="form-label">Page Count</label>
                    <input
                      className="form-control"
                      name="pageCount"
                      type="number"
                      value={formData.pageCount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price</label>
                    <input
                      className="form-control"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    {editingBook ? "Update Book" : "Add Book"}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Books Table */}
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBooks;
