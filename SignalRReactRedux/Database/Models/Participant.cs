using System;

namespace SignalRReactRedux.Database.Models
{
    public class Participant
    {
        public Guid Id { get; set; }
        public string Nickname { get; set; }
        public string ConnectionId { get; set; }
    }
}
