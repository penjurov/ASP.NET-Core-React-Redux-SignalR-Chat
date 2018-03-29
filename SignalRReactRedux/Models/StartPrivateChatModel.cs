using System;

namespace SignalRReactRedux.Models
{
    public class StartPrivateChatModel : SendMessageModel
    {
        public Guid OtherParticipantId { get; set; }
    }
}
