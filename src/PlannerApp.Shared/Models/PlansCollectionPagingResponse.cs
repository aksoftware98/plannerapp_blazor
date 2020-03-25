namespace PlannerApp.Shared.Models
{
    public class PlansCollectionPagingResponse : BaseAPIResponse
    {
        public Plan[] Records { get; set; }
      
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int? NextPage { get; set; }
        public int Count { get; set; }
    }
}
