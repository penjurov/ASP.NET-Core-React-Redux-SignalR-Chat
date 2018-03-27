using Microsoft.AspNetCore.SignalR;
using SignalRReactRedux.Database;
using SignalRReactRedux.Models;
using System.Threading.Tasks;

namespace SignalRReactRedux.Hubs
{
    public class ChatHub: Hub
    {
        private readonly FakeDatabase dataBase;

        public ChatHub()
        {
            dataBase = FakeDatabase.Instance;
        }

        public Task SendMessage(SendMessageModel model)
        {
            return Clients.Group(model.RoomName).InvokeAsync("SendMessage",
                new {
                    roomName = model.RoomName,
                    message = model.Message,
                    user = model.User,
                    participants = dataBase.GetUsers(model.RoomName)
                });
        }

        public Task JoinGroup(SendMessageModel model)
        {
            dataBase.AddUser(model.User, model.RoomName);
            Groups.AddAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.User + " joined #" + model.RoomName;
            return SendMessage(model);
        }

        public Task LeaveGroup(SendMessageModel model)
        {
            dataBase.RemoveUser(model.User, model.RoomName);
            Groups.RemoveAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.User + " left #" + model.RoomName;
            return SendMessage(model);
        }
    }
}
