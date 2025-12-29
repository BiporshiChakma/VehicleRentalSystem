import { pool } from "../../config/db";

const getVehicleById = async (vehicle_id: number) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  return result.rows[0];
};

const checkBookingOverlap = async (
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  const result = await pool.query(
    `SELECT id FROM bookings
     WHERE vehicle_id = $1
     AND NOT (rent_end_date < $2 OR rent_start_date > $3)`,
    [vehicle_id, rent_start_date, rent_end_date]
  );
  return result.rows.length > 0;
};

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number
) => {
  const result = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  return result.rows[0];
};

const getAllBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result.rows;
};

const getOwnBooking = async (customer_id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1`,
    [customer_id]
  );
  return result.rows;
};

export const bookingService = {
  getVehicleById,
  checkBookingOverlap,
  createBooking,
  getAllBookings,
  getOwnBooking
};
