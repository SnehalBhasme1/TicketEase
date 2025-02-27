const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");
const { createTicket, getAllTickets, getMyTickets, updateTicket, deleteTicket } = require("../controllers/ticketController");

const router = express.Router();

// Customer Routes
router.post("/", authenticateUser, authorizeRoles("customer"), createTicket);
router.get("/my-tickets", authenticateUser, authorizeRoles("customer"), getMyTickets);
router.put("/:id", authenticateUser, authorizeRoles("customer"), updateTicket);

// Admin Routes
router.get("/", authenticateUser, authorizeRoles("admin"), getAllTickets);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteTicket);

module.exports = router;
