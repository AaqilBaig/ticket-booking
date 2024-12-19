async function getTickets() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch('https://ticket-booking-4vn9.onrender.com/tickets', {
      signal: controller.signal,
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out - server took too long to respond');
    }
    throw error;
  }
}

async function TicketList() {
  try {
    const tickets = await getTickets();

    if (!tickets || tickets.length === 0) {
      return <p className="text-center p-4">No tickets found</p>;
    }

    return (
      <div className="grid gap-4 p-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="card my-5">
            <h3>{ticket.title}</h3>
            <p>{ticket.body.slice(0, 200)}...</p>
            <div className={`pill ${ticket.priority}`}>
              {ticket.priority} priority
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading tickets: {error.message}
        <p className="mt-2 text-sm">Please try again later</p>
      </div>
    );
  }
}

export default TicketList;