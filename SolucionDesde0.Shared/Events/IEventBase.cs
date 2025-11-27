using MassTransit;
using System;
using System.Collections.Generic;
using System.Text;

namespace SolucionDesde0.Shared.Events
{
    [ExcludeFromTopology]
    public interface IEventBase
    {
        Guid EventId { get; }
        DateTime CreatedAt { get; }
    }
}
