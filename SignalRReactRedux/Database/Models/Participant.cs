using System;

namespace SignalRReactRedux.Database.Models
{
    public class Participant
    {
        public Guid Id { get; set; }
        public string NickName { get; set; }
        public string ConnectionId { get; set; }
    }
}
