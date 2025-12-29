import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { pool } from "../../config/db";

const booking = async (req: Request, res: Response) => {
  const customer_id = req.User?.id; 
  const { vehicle_id, rent_start_date, rent_end_date } = req.body;

  if (!customer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    
    const vehicle = await bookingService.getVehicleById(vehicle_id);
  //  console.log(vehicle);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    
    if (vehicle.status === true) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already booked",
      });
    }

  
    const isOverlapping = await bookingService.checkBookingOverlap(
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    if (isOverlapping) {
      return res.status(409).json({
        success: false,
        message: "Vehicle not available for selected dates",
      });
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    const total_price = days * vehicle. daily_rent_price;

    const bookingData = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: bookingData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};
 const getBookings = async (req: Request, res: Response) => {
  try {
    let bookings;

    if (req.User?.role === "admin") {
     
      const result = await pool.query("SELECT * FROM bookings");
      bookings = result.rows;
       res.json({ success: true, bookings });
    } else if (req.User?.role === "user") {
  
    const getOwnBooking = await bookingService.getOwnBooking(req.User.id);


  if (getBookings.length === 0) {
    return res.status(404).json({ message: "Booking not found or not authorized" });
  }
 
  res.json({ success: true, getOwnBooking });
}}catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  console.log(req.User);
  console.log(req.User?.role );
  if (isNaN(bookingId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking id",
    });
  }

  try {
    if (req.User?.role === "admin") {
      const { status } = req.body;
      
      if (typeof status !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Status must be boolean",
        });
      }

      const bookingResult = await pool.query(
        "SELECT * FROM bookings WHERE id = $1",
        [bookingId]
      );

      if (bookingResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const booking = bookingResult.rows[0];
      await pool.query(
        "UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2",
        [status, bookingId]
      );
      await pool.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        [!status, booking.vehicle_id]
      );

      return res.status(200).json({
        success: true,
        message: "Booking updated by admin",
      });
    }
  //  console.log("JWT USER:", req.User);
    if (req.User?.role === "user") {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE id = $1 AND customer_id = $2",
    [bookingId, req.User.id]
  );


  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  const booking = result.rows[0];

  if (!booking.rent_start_date) {
    return res.status(400).json({
      success: false,
      message: "Rent start date not set yet",
    });
  }

  if (booking.status === false) {
    return res.status(400).json({
      success: false,
      message: "Booking already cancelled",
    });
  }

  if (new Date(booking.rent_start_date).getTime() <= Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Cannot cancel after start date",
    });
  }

  await pool.query("BEGIN");

  await pool.query(
    "UPDATE bookings SET status = false, updated_at = NOW() WHERE id = $1",
    [bookingId]
  );

  await pool.query(
    "UPDATE vehicles SET availability_status = true WHERE id = $1",
    [booking.vehicle_id]
  );

  await pool.query("COMMIT");

  return res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  });
}

    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });

  } catch (err) {
    console.error("Update booking error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const bookingController = {
  booking,getBookings,updateBooking
};
