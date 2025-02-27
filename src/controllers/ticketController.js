const Ticket = require("../models/Ticket");
const { sendBookingEmail } = require("../utils/emailService");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { dateOfTravel, modeOfTravel, perHeadPrice, from, to, numberOfPassengers } = req.body;

    const newTicket = new Ticket({
      userId: req.user.id, // Get user ID from JWT
      dateOfTravel,
      modeOfTravel,
      perHeadPrice,
      from,
      to,
      numberOfPassengers,
      totalPrice: perHeadPrice * numberOfPassengers, // Auto-calculate
    });

    await newTicket.save();

    // Send Email Notification
    await sendBookingEmail(req.user.email, newTicket);

    res.status(201).json({ message: "Ticket booked successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Tickets (Admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("userId", "name email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get My Tickets (Customer)
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Ticket (Customer) - Not allowed within 24 hours of travel
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const currentTime = new Date();
    const travelTime = new Date(ticket.dateOfTravel);
    const hoursDiff = (travelTime - currentTime) / (1000 * 60 * 60);

    if (hoursDiff < 24) return res.status(400).json({ message: "Cannot update within 24 hours of travel" });

    Object.assign(ticket, req.body);
    await ticket.save();
    res.json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Ticket (Admin)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
