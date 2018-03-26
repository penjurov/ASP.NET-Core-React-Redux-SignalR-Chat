using Microsoft.AspNetCore.SignalR;
using SignalRReactRedux.Models;
using System.Threading.Tasks;

namespace SignalRReactRedux.Hubs
{
    public class ChatHub: Hub
    {
        public Task SendMessage(SendMessageModel model)
        {
            return Clients.Group(model.RoomName).InvokeAsync("SendMessage",
            new {
                roomName = model.RoomName,
                message = model.Message,
                user = model.User
            });
        }

        public Task JoinGroup(SendMessageModel model)
        {
            Groups.AddAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.User + " has joined " + model.RoomName;
            return SendMessage(model);
        }

        public Task LeaveGroup(SendMessageModel model)
        {
            Groups.RemoveAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.User + " has leaved " + model.RoomName;
            return SendMessage(model);
        }
    }
}
