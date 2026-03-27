using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Eifert.Controllers;

namespace Mission11_Eifert.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksContext _context;

    public BooksController(BooksContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortOrder = "asc",
        [FromQuery] string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category
        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category == category);

        // Sort by title
        query = sortOrder == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var books = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { books, totalCount, totalPages, currentPage = page, pageSize });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }
}