using System.Collections.Generic;
using System.Linq;

namespace SignalRReactRedux.Database
{
    public class FakeDatabase
    {
        private static Dictionary<string,List<string>> usersByRooms = new Dictionary<string, List<string>>();

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

        public List<string> GetUsers(string roomName)
        {
            var result = new List<string>();

            if (usersByRooms.ContainsKey(roomName))
            {
                result = usersByRooms[roomName];
            }

            return result;
        }

        public void AddUser(string user, string roomName)
        {
            if (usersByRooms.ContainsKey(roomName))
            {
                var users = usersByRooms[roomName];
                if (!users.Contains(user))
                {
                    users.Add(user);
                }

                usersByRooms[roomName] = users;
            }
            else
            {
                usersByRooms.Add(roomName, new List<string>
                {
                    user
                });
            }
            
        }

        public void RemoveUser(string user, string roomName)
        {
            if (usersByRooms.ContainsKey(roomName))
            {
                var users = usersByRooms[roomName];
                if (users.Contains(user))
                {
                    users = users.Where(x => x != user).ToList();
                    usersByRooms[roomName] = users;
                }
            }
        }
    }
}
