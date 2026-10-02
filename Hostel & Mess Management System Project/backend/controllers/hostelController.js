const pool = require("../config/db");


// =========================================
// GET ALL HOSTELS
// =========================================

const getAllHostels = async (req, res) => {
    try {
        const [hostels] = await pool.query(
            `
            SELECT
                id,
                name,
                location,
                created_at
            FROM hostels
            ORDER BY id
            `
        );

        res.json({
            message: "Hostels retrieved successfully",
            hostels: hostels
        });

    } catch (error) {
        console.error("Get hostels error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL ROOMS
// =========================================

const getAllRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query(
            `
            SELECT
                rooms.id,
                rooms.room_number,
                rooms.capacity,
                rooms.occupied_count,
                hostels.id AS hostel_id,
                hostels.name AS hostel_name,
                hostels.location
            FROM rooms
            INNER JOIN hostels
                ON rooms.hostel_id = hostels.id
            ORDER BY hostels.id, rooms.room_number
            `
        );

        res.json({
            message: "Rooms retrieved successfully",
            rooms: rooms
        });

    } catch (error) {
        console.error("Get rooms error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// CREATE HOSTEL
// ADMIN ONLY
// =========================================

const createHostel = async (req, res) => {
    try {
        const { name, location } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Hostel name is required"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO hostels
            (name, location)
            VALUES (?, ?)
            `,
            [name, location || null]
        );

        res.status(201).json({
            message: "Hostel created successfully",
            hostel: {
                id: result.insertId,
                name: name,
                location: location || null
            }
        });

    } catch (error) {
        console.error("Create hostel error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// CREATE ROOM
// ADMIN OR WARDEN
// =========================================

const createRoom = async (req, res) => {
    try {
        const {
            hostel_id,
            room_number,
            capacity
        } = req.body;

        if (!hostel_id || !room_number || !capacity) {
            return res.status(400).json({
                message: "Hostel, room number and capacity are required"
            });
        }

        // Check hostel exists
        const [hostels] = await pool.query(
            "SELECT id FROM hostels WHERE id = ?",
            [hostel_id]
        );

        if (hostels.length === 0) {
            return res.status(404).json({
                message: "Hostel not found"
            });
        }

        // Check room already exists in this hostel
        const [existingRooms] = await pool.query(
            `
            SELECT id
            FROM rooms
            WHERE hostel_id = ?
            AND room_number = ?
            `,
            [hostel_id, room_number]
        );

        if (existingRooms.length > 0) {
            return res.status(400).json({
                message: "Room already exists in this hostel"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO rooms
            (hostel_id, room_number, capacity, occupied_count)
            VALUES (?, ?, ?, 0)
            `,
            [hostel_id, room_number, capacity]
        );

        res.status(201).json({
            message: "Room created successfully",
            room: {
                id: result.insertId,
                hostel_id: hostel_id,
                room_number: room_number,
                capacity: capacity,
                occupied_count: 0
            }
        });

    } catch (error) {
        console.error("Create room error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getAllHostels,
    getAllRooms,
    createHostel,
    createRoom
};