using AKSoftware.WebApi.Client;
using PlannerApp.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PlannerApp.Shared.Services
{
    public class PlansService
    {
        private readonly string _baseUrl;

        ServiceClient client = new ServiceClient();

        public PlansService(string url)
        {
            _baseUrl = url;
        }

        public string AccessToken
        {
            get => client.AccessToken;
            set
            {
                client.AccessToken = value; 
            }
        }

        /// <summary>
        /// Retrieve all the plans from the API with pagination
        /// </summary>
        /// <param name="page">Number of the page</param>
        /// <returns></returns>
        public async Task<PlansCollectionPagingResponse> GetAllPlansByPageAsync(int page = 1)
        {
            var response = await client.GetProtectedAsync<PlansCollectionPagingResponse>($"{_baseUrl}/api/plans?page={page}");
            return response.Result; 
        }

        /// <summary>
        /// Return a Plan by ID
        /// </summary>
        /// <param name="id">ID of the plan to be retrieved</param>
        /// <returns></returns>
        public async Task<PlanSingleResponse> GetPlanByIdAsync(string id)
        {
            var response = await client.GetProtectedAsync<PlanSingleResponse>($"{_baseUrl}/api/plans/{id}");
            return response.Result;
        }

        /// <summary>
        /// Retrieve all the plans from the API with pagination
        /// </summary>
        /// <param name="page">Number of the page</param>
        /// <returns></returns>
        public async Task<PlansCollectionPagingResponse> SearchPlansByPageAsync(string query, int page = 1)
        {
            var response = await client.GetProtectedAsync<PlansCollectionPagingResponse>($"{_baseUrl}/api/plans/search?query={query}&page={page}");
            return response.Result;
        }

        /// <summary>
        /// Post a plan to the API
        /// </summary>
        /// <param name="model">object represnets the plan to be added</param>
        /// <returns></returns>
        public async Task<PlanSingleResponse> PostPlanAsync(PlanRequest model)
        {
            var formKeyValues = new List<FormKeyValue>()
            {
                new StringFormKeyValue("Title", model.Title),
                new StringFormKeyValue("Description", model.Description),
            };

            if (model.CoverFile != null)
                formKeyValues.Add(new FileFormKeyValue("CoverFile", model.CoverFile, model.FileName));

            var response = await client.SendFormProtectedAsync<PlanSingleResponse>($"{_baseUrl}/api/plans", ActionType.POST, formKeyValues.ToArray());

            return response.Result; 
        }

        /// <summary>
        /// Edit a plan to the API
        /// </summary>
        /// <param name="model">object represnets the plan to be added</param>
        /// <returns></returns>
        public async Task<PlanSingleResponse> EditPlanAsync(PlanRequest model)
        {
            var formKeyValues = new List<FormKeyValue>()
            {
                 new StringFormKeyValue("Id", model.Id),
                new StringFormKeyValue("Title", model.Title),
                new StringFormKeyValue("Description", model.Description),
            };

            if (model.CoverFile != null)
                formKeyValues.Add(new FileFormKeyValue("CoverFile", model.CoverFile, model.FileName));

            var response = await client.SendFormProtectedAsync<PlanSingleResponse>($"{_baseUrl}/api/plans", ActionType.PUT, formKeyValues.ToArray());

            return response.Result;
        }

        /// <summary>
        /// Delete plan from the account
        /// </summary>
        /// <param name="id">ID of the plan to be deleted</param>
        /// <returns></returns>
        public async Task<PlanSingleResponse> DeletePlanAsync(string id)
        {
            var response = await client.DeleteProtectedAsync<PlanSingleResponse>($"{_baseUrl}/api/plans/{id}");
            return response.Result; 
        }

    }
}
