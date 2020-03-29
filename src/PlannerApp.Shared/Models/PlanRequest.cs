using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Text;

namespace PlannerApp.Shared.Models
{
    public class PlanRequest
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(256)]
        public string Description { get; set; }

        public Stream CoverFile { get; set; }

        public string FileName { get; set; }
    }
}
