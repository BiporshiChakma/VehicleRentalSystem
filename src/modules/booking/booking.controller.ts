import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { pool } from "../../config/db";

const booking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  if (!customer_id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const vehicle = await bookingService.getVehicleById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

 
    if (vehicle.availability_status === false) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already booked",
      });
    }


    const isOverlapping = await bookingService.checkBookingOverlap( vehicle_id, rent_start_date,rent_end_date
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

    const total_price = days * Number(vehicle.daily_rent_price);

    // Create booking
    const bookingData = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      start.toISOString().slice(0, 10), 
      end.toISOString().slice(0, 10),
      total_price
    );
console.log("err",bookingData)
const formattedBooking = {
  ...bookingData,
  rent_start_date: new Date(bookingData.rent_start_date)
    .toISOString()
    .slice(0, 10),
  rent_end_date: new Date(bookingData.rent_end_date)
    .toISOString()
    .slice(0, 10),
 status : bookingData.status ? "active" : "cancelled",
  vehicle: {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: Number(vehicle.daily_rent_price),
  },
  created_at: new Date(bookingData.created_at).toISOString().slice(0, 10),
    updated_at: new Date(bookingData.updated_at).toISOString().slice(0, 10),
};

res.status(201).json({
  success: true,
  message: "Booking created successfully",
  booking: formattedBooking,
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
    console.log(req.User?.role)
    const role = req.User?.role;
    const userId = req.User?.id;

    if (!role || !userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let bookings: any[] = [];

    if (role === "admin") {
      bookings = await bookingService.getAllBookings();
    } else if (role === "customer") {
  const bookings = await bookingService.getOwnBooking(userId);
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No bookings found",
    });
  }
 // console.log(bookin)
  const formattedBookings = await Promise.all(
    bookings.map(async (b: any) => ({
     data: console.log(b.rent_start_date),
      id: b.id,
      customer_id: b.customer_id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date? new Date(b.rent_start_date).toISOString().slice(0, 10) : null,
      rent_end_date: b.rent_end_date ? new Date(b.rent_end_date).toISOString().slice(0, 10) : null,
      total_price: Number(b.total_price),
      status: b.status ? "active" : "cancelled or returned",
      vehicle: await bookingService.vehicleInfo(b.vehicle_id),
      created_at: b.created_at,
      updated_at: b.updated_at,
    }))
  );

  return res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    bookings: formattedBookings,
  });
}

const bookingArray: any[] = bookings;
//console.log(bookingArray);
const formattedBookings = await Promise.all(
  bookingArray.map(async (b) => ({
    date: console.log( new Date(b.rent_start_date).toISOString().slice(0, 10) ),
    id: b.id,
    customer_id: b.customer_id,
    vehicle_id: b.vehicle_id,
   rent_start_date: new Date(b.rent_start_date).toISOString().slice(0, 10),
  rent_end_date: new Date(b.rent_end_date).toISOString().slice(0, 10),
    
    total_price: Number(b.total_price),
    status: b.status ? "active" : "cancelled",
    customer: await bookingService.customerInfo(b.customer_id),
    vehicle: await bookingService.vehicleInfo(b.vehicle_id),
  }))
);
    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  // console.log(req.User);
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
      let bol: boolean;
      
      if (status === "active") {
       bol = true;
      }
     else if(status === "returned"){
       bol = false;
     }
     else{
       return res.status(400).json({
          success: false,
          message: "Status must be returned",
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
      
        if (booking.status === false) {
    return res.status(400).json({
      success: false,
      message: "Booking already cancelled",
    });
  }
      await pool.query(
        "UPDATE bookings SET status = $1,vehicle=$2, updated_at = NOW() WHERE id = $3",
        [bol,bol, bookingId]
      );
      await pool.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        [!bol, booking.vehicle_id]
      );
        console.log(booking.status)
      const bookingFormate = {
         ...booking,
          rent_start_date: new Date(booking.rent_start_date).toISOString().slice(0, 10),
          rent_end_date: new Date(booking.rent_end_date).toISOString().slice(0, 10),
         status: booking.status = "returned" ,
         vehicle: booking.vehicle ? "unavailable" : "available" 
        };
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: bookingFormate
      
      });
    }
  //  console.log("JWT USER:", req.User);
    if (req.User?.role === "customer") {
       const { status } = req.body;
        let bol: boolean;
      
      if (status === "active") {
       bol = true;
      }
     else if(status === "cancelled"){
       bol = false;
     }
     else{
       return res.status(400).json({
          success: false,
          message: "Only Admin Returns The Booking.IF you donot want,You should canclled the Booking",
        });
     }
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
  console.log("test",booking)
  if (booking.status === false) {
    return res.status(400).json({
      success: false,
      message: "Booking already cancelled",
      data: booking
    });
  }


   await pool.query(
        "UPDATE bookings SET status = $1,vehicle=$2, updated_at = NOW() WHERE id = $3",
        [bol,bol, bookingId]
      );
      await pool.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        [!bol, booking.vehicle_id]
      );

const bookingFormate = {
         ...booking,
          rent_start_date: new Date(booking.rent_start_date).toISOString().slice(0, 10),
          rent_end_date: new Date(booking.rent_end_date).toISOString().slice(0, 10),
         status: booking.status = "cancelled" ,
         vehicle: booking.vehicle ? "unavailable" : "available" 
        };
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: bookingFormate
      
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
 