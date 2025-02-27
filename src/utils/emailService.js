const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

exports.sendBookingEmail = async (userEmail, ticketDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      cc: "venugopal.burli@masaischool.com",
      subject: "Ticket Booking Confirmation - TicketEase",
      text: `Dear Customer,

Your ticket has been successfully booked! 

Details:
- From: ${ticketDetails.from}
- To: ${ticketDetails.to}
- Date of Travel: ${ticketDetails.dateOfTravel}
- Mode of Travel: ${ticketDetails.modeOfTravel}
- Number of Passengers: ${ticketDetails.numberOfPassengers}
- Total Price: ₹${ticketDetails.totalPrice}

Thank you for booking with TicketEase!`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
