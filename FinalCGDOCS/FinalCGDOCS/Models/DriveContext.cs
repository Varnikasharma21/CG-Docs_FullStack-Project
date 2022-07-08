using System;
using Microsoft.EntityFrameworkCore;

namespace FinalCGDOCS.Models
{
    public partial class DriveContext : DbContext
    {
        public DriveContext()
        {
        }

        public DriveContext(DbContextOptions<DriveContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Documents> Documents { get; set; }
        public virtual DbSet<Folders> Folders { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=Drive;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Documents>(entity =>
            {
                entity.HasKey(e => e.DocumentId);

                entity.Property(e => e.DocumentCreatedAt)
                    .HasColumnName("Document_Created_At")
                    .HasColumnType("smalldatetime");

                entity.Property(e => e.DocumentCreatedBy).HasColumnName("Document_Created_By");

                entity.Property(e => e.DocumentIsDeleted).HasColumnName("Document_isDeleted");

                entity.Property(e => e.DocumentIsFavourite)
                    .HasColumnName("Document_isFavourite")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.DocumentName)
                    .HasColumnName("Document_Name")
                    .HasMaxLength(20);

                entity.Property(e => e.DocumentSize).HasColumnName("Document_Size");

                entity.Property(e => e.DocumentType)
                    .HasColumnName("Document_Type")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.FolderId).HasColumnName("Folder_Id");

                entity.HasOne(d => d.DocumentCreatedByNavigation)
                    .WithMany(p => p.Documents)
                    .HasForeignKey(d => d.DocumentCreatedBy)
                    .HasConstraintName("FK__Documents__Docum__6383C8BA");

                entity.HasOne(d => d.Folder)
                    .WithMany(p => p.Documents)
                    .HasForeignKey(d => d.FolderId)
                    .HasConstraintName("FK__Documents__Folde__656C112C");
            });

            modelBuilder.Entity<Folders>(entity =>
            {
                entity.HasKey(e => e.FolderId);

                entity.Property(e => e.FolderId).HasColumnName("Folder_Id");

                entity.Property(e => e.FolderCreatedAt)
                    .HasColumnName("Folder_Created_At")
                    .HasColumnType("smalldatetime");

                entity.Property(e => e.FolderCreatedBy).HasColumnName("Folder_Created_By");

                entity.Property(e => e.FolderIsDeleted)
                    .HasColumnName("Folder_isDeleted")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.FolderIsFavourite)
                    .HasColumnName("Folder_isFavourite")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.FolderName)
                    .HasColumnName("Folder_Name")
                    .HasMaxLength(100);

                entity.HasOne(d => d.FolderCreatedByNavigation)
                    .WithMany(p => p.Folders)
                    .HasForeignKey(d => d.FolderCreatedBy)
                    .HasConstraintName("FK__Folders__Folder___5EBF139D");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserCreatedAt)
                    .HasColumnName("User_Created_At")
                    .HasColumnType("smalldatetime");

                entity.Property(e => e.UserPassword)
                    .HasColumnName("User_Password")
                    .HasMaxLength(100);

                entity.Property(e => e.Username).HasMaxLength(100);
            });
        }
    }
}
