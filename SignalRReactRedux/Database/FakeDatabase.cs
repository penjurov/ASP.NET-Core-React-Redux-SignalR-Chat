using System;
using System.Collections.Generic;
using System.Linq;

namespace SignalRReactRedux.Database
{
    public class FakeDatabase
    {
        private const string GENERAL_GROUP_NAME = "general";
        private static Dictionary<string,List<Participant>> usersByRooms = new Dictionary<string, List<Participant>>();

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
            var result = new List<Participant>();

            if (usersByRooms.ContainsKey(roomName))
            {
                result = usersByRooms[roomName];
            }

            return result;
        }

        public void AddUser(Participant participant, string roomName)
        {
            if (IsNickNameTaken(participant))
            {
                throw new Exception("Nickname is taken");
            }

            if (usersByRooms.ContainsKey(roomName))
            {
                var users = usersByRooms[roomName];
                if (!users.Any(x => x.Id == participant.Id))
                {
                    users.Add(participant);
                }
                else
                {
                    var user = users.FirstOrDefault(x => x.Id == participant.Id);
                    user.NickName = participant.NickName;
                }

                usersByRooms[roomName] = users;
            }
            else
            {
                usersByRooms.Add(roomName, new List<Participant>
                {
                    participant
                });
            }
        }

        private bool IsNickNameTaken(Participant participant)
        {
            // Can't leave general all users are there
            return usersByRooms.ContainsKey(GENERAL_GROUP_NAME) && usersByRooms[GENERAL_GROUP_NAME].Any(x => x.NickName == participant.NickName && x.Id != participant.Id);
        }

        public void RemoveUser(Guid? id, string roomName)
        {
            if (usersByRooms.ContainsKey(roomName))
            {
                var users = usersByRooms[roomName];
                if (users.Any(x => x.Id == id))
                {
                    users = users.Where(x => x.Id != id).ToList();
                    usersByRooms[roomName] = users;
                }
            }
        }
    }
}
