using System;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PurchasesContext : DbContext
    {
        public DbSet<Purchase> Purchases { get; set; }

        public PurchasesContext(DbContextOptions<PurchasesContext> options)
            : base(options)
        {
        }
    }
}
