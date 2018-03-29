using Microsoft.AspNetCore.SignalR;
using SignalRReactRedux.Database;
using SignalRReactRedux.Database.Models;
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
            return Clients.Group(model.RoomName).InvokeAsync(model.Action ?? "SendMessage", new
            {
                roomName = model.RoomName,
                message = model.Message,
                nickName = model.NickName,
                participantId = model.ParticipantId,
                participants = dataBase.GetUsers(model.RoomName),
                isPrivateRoom = model.IsPrivateRoom
            });
        }

        public Task JoinGroup(SendMessageModel model)
        {
            Participant participant;

            if (model.ParticipantId.HasValue)
            {
                participant = dataBase.GetUser(model.ParticipantId.Value);

                if (participant == null)
                {
                    participant = CreateParticipant(model);
                }
                else
                {
                    participant.NickName = model.NickName;
                    participant.ConnectionId = Context.ConnectionId;
                }
            }
            else
            {
                participant = CreateParticipant(model);
            }

            dataBase.JoinRoom(participant.Id, model.RoomName, false);

            Groups.AddAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.NickName + " joined " + model.RoomName;
            model.ParticipantId = participant.Id;
            model.Action = "JoinRoom";
            return SendMessage(model);
        }

        private Participant CreateParticipant(SendMessageModel model)
        {
            var participant = new Participant
            {
                Id = model.ParticipantId ?? Guid.NewGuid(),
                NickName = model.NickName,
                ConnectionId = Context.ConnectionId
            };

            dataBase.AddUser(participant);
            return participant;
        }

        public Task LeaveGroup(SendMessageModel model)
        {
            dataBase.LeaveRoom(model.ParticipantId, model.RoomName);
            Groups.RemoveAsync(Context.ConnectionId, model.RoomName);
            model.Message = model.NickName + " left " + model.RoomName;
            return SendMessage(model);
        }

        public Task StartPrivateChat(StartPrivateChatModel model)
        {
            var otherUser = dataBase.GetUser(model.OtherParticipantId);
            Groups.AddAsync(Context.ConnectionId, model.RoomName);
            Groups.AddAsync(otherUser.ConnectionId, model.RoomName);

            dataBase.JoinRoom(model.ParticipantId.Value, model.RoomName, true);
            dataBase.JoinRoom(model.OtherParticipantId, model.RoomName, true);

            model.Message = model.NickName + " started private chat with " + otherUser.NickName;
            model.Action = "StartPrivateChat";
            return SendMessage(model);
        }
    }
}
