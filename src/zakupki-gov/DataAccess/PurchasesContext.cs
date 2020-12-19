using System;
using Microsoft.EntityFrameworkCore;
using Purchases.DataAccess;

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
