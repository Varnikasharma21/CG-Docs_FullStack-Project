using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalCGDOCS.RequestModels
{
    public class DocumentsRequest
    {
        public string DocumentName { get; set; }
        public string DocumentType { get; set; }
        public int? DocumentSize { get; set; }
        public int? DocumentCreatedBy { get; set; }
        public DateTime? DocumentCreatedAt { get; set; }
        public int? FolderId { get; set; }
        public bool DocumentIsDeleted { get; set; }
        public bool? DocumentIsFavourite { get; set; }
    }
}
