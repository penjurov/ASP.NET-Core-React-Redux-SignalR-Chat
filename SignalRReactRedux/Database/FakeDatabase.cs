using SignalRReactRedux.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SignalRReactRedux.Database
{
    public class FakeDatabase
    {
        private const string GENERAL_GROUP_NAME = "#general";
        private static List<Participant> participants = new List<Participant>();
        private static List<Room> rooms = new List<Room>();

        private static FakeDatabase instance;

        private FakeDatabase() { }

        public static FakeDatabase Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new FakeDatabase();
                }

                return instance;
            }
        }

        public List<Participant> GetUsers(string roomName)
        {
            var participantIds = rooms.FirstOrDefault(x => x.Name == roomName).ParticipantIds;
            return participants.Where(x => participantIds.Contains(x.Id)).ToList();
        }

        public Participant GetUser(Guid id)
        {
            return participants.FirstOrDefault(x => x.Id == id);
        }

        public void AddUser(Participant participant)
        {
            if (IsNickNameTaken(participant))
            {
                throw new Exception("Nickname is taken");
            }

            participants.Add(participant);
        }

        public void JoinRoom(Guid participantId, string roomName, bool isPrivateRoom)
        {
            var room = rooms.FirstOrDefault(x => x.Name == roomName);

            if (room != null)
            {
                if (!room.ParticipantIds.Any(x => x == participantId) && (room.IsPrivateRoom ? room.ParticipantIds.Count <= 2 : true))
                {
                    room.ParticipantIds.Add(participantId);
                }
            }
            else
            {
                room = new Room
                {
                    Id = Guid.NewGuid(),
                    Name = roomName,
                    ParticipantIds = new List<Guid> { participantId },
                    IsPrivateRoom = isPrivateRoom
                };

                rooms.Add(room);
            }
        }

        private bool IsNickNameTaken(Participant participant)
        {
            return participants.Any(x => x.NickName == participant.NickName && x.Id != participant.Id);
        }

        public void LeaveRoom(Guid? id, string roomName)
        {
            var room = rooms.FirstOrDefault(x => x.Name == roomName);

            if (room != null)
            {
                if (room.ParticipantIds.Any(x => x == id))
                {
                    room.ParticipantIds = room.ParticipantIds.Where(x => x != id).ToList();
                }
            }
        }
    }
}
