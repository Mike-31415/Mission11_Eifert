using Microsoft.EntityFrameworkCore;

namespace Mission11_Eifert.Controllers;

public class BooksContext : DbContext
{
    public BooksContext(DbContextOptions<BooksContext> options) : base(options)
    {
    }

    public DbSet<Books> Books { get; set; } = null!;
}