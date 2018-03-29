using System;
using System.Collections.Generic;

namespace SignalRReactRedux.Database.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Guid> ParticipantIds { get; set; }
        public bool IsPrivateRoom { get; set; }
    }
}
