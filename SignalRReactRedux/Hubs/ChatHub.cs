using Microsoft.AspNetCore.SignalR;
using SignalRReactRedux.Database;
using SignalRReactRedux.Models;
using System;
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
                    nickName = model.NickName,
                    participantId = model.ParticipantId,
                    participants = dataBase.GetUsers(model.RoomName)
                });
        }

        public Task JoinGroup(SendMessageModel model)
        {
            var participant = new Participant
            {
                Id = model.ParticipantId ?? Guid.NewGuid(),
                NickName = model.NickName
            };

            dataBase.AddUser(participant, model.RoomName);
            Groups.AddAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.NickName + " joined #" + model.RoomName;
            model.ParticipantId = participant.Id;
            return SendMessage(model);
        }

        public Task LeaveGroup(SendMessageModel model)
        {
            dataBase.RemoveUser(model.ParticipantId, model.RoomName);
            Groups.RemoveAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.NickName + " left #" + model.RoomName;
            return SendMessage(model);
        }
    }
}
