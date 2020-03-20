using System;
using System.Collections.Generic;
using System.Text;

namespace PlannerApp.Shared.Models
{
    public class ToDoItem
    {

        public string Id { get; set; }
        public string Description { get; set; }
        public bool IsDone { get; set; }
        public DateTime EstimatedDate { get; set; }
        public DateTime AchievedDate { get; set; }
        public string PlanId { get; set; }

    }
}
