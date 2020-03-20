namespace PlannerApp.Shared.Models
{
    public class Plan
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CoverPath { get; set; }
        public ToDoItem[] ToDoItems { get; set; }
    }
}
