using AKSoftware.WebApi.Client;
using PlannerApp.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PlannerApp.Shared.Services
{
    public class ToDoItemsService
    {

        private readonly string _baseUrl;

        ServiceClient client = new ServiceClient();

        public ToDoItemsService(string url)
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
        /// Insert a new ToDo item inside a specific Plan
        /// </summary>
        /// <param name="model">object represents the item to be added</param>
        /// <returns></returns>
        public async Task<ToDoItemSingleResponse> CreateItemAsync(ToDoItemRequest model)
        {
            var response = await client.PostProtectedAsync<ToDoItemSingleResponse>($"{_baseUrl}/api/todoitems", model);
            return response.Result; 
        }

        /// <summary>
        /// Edit the description of a specific item
        /// </summary>
        /// <param name="model">object represents the item to be edited</param>
        /// <returns></returns>
        public async Task<ToDoItemSingleResponse> EdittemAsync(ToDoItemRequest model)
        {
            var response = await client.PutProtectedAsync<ToDoItemSingleResponse>($"{_baseUrl}/api/todoitems", model);
            return response.Result;
        }

        /// <summary>
        /// Mark the item as done if it's undone and vice versa
        /// </summary>
        /// <param name="model">ID of the item to be updated</param>
        /// <returns></returns>
        public async Task<ToDoItemSingleResponse> ChangeItemStateAsync(string id)
        {
            var response = await client.PutProtectedAsync<ToDoItemSingleResponse>($"{_baseUrl}/api/todoitems/{id}", null);
            return response.Result;
        }

        /// <summary>
        /// Mark the item as done if it's undone and vice versa
        /// </summary>
        /// <param name="model">ID of the item to be updated</param>
        /// <returns></returns>
        public async Task<ToDoItemSingleResponse> DeleteItemAsync(string id)
        {
            var response = await client.DeleteProtectedAsync<ToDoItemSingleResponse>($"{_baseUrl}/api/todoitems/{id}");
            return response.Result;
        }



    }
}
