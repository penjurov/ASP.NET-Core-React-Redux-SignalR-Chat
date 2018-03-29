using System;

namespace SignalRReactRedux.Models
{
    public class SendMessageModel
    {
        public string Message { get; set; }
        public string NickName { get; set; }
        public string RoomName { get; set; }
        public Guid? ParticipantId { get; set; }
        public string Action { get; set; }
        public bool IsPrivateRoom { get; set; }
    }
}
