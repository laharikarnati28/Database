const pool = require("../config/db");


// =========================================
// ALLOCATE ROOM
// ADMIN / WARDEN
// =========================================

const allocateRoom = async (req, res) => {
    const connection = await pool.getConnection();

    try {

        const {
            student_id,
            room_id,
            start_date
        } = req.body;

        if (
            !student_id ||
            !room_id ||
            !start_date
        ) {
            return res.status(400).json({
                message:
                    "Student, room and start date are required"
            });
        }

        await connection.beginTransaction();

        const [students] =
            await connection.query(
                `
                SELECT
                    students.id,
                    students.roll_number,
                    users.name
                FROM students
                INNER JOIN users
                    ON students.user_id = users.id
                WHERE students.id = ?
                `,
                [student_id]
            );

        if (students.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Student not found"
            });
        }

        const student = students[0];

        const [existingAllocation] =
            await connection.query(
                `
                SELECT id
                FROM room_allocations
                WHERE student_id = ?
                AND status = 'active'
                `,
                [student_id]
            );

        if (existingAllocation.length > 0) {

            await connection.rollback();

            return res.status(400).json({
                message:
                    "Student is already assigned to a room"
            });
        }

        const [rooms] =
            await connection.query(
                `
                SELECT
                    id,
                    hostel_id,
                    room_number,
                    capacity,
                    occupied_count
                FROM rooms
                WHERE id = ?
                FOR UPDATE
                `,
                [room_id]
            );

        if (rooms.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Room not found"
            });
        }

        const room = rooms[0];

        if (
            room.occupied_count >=
            room.capacity
        ) {

            await connection.rollback();

            return res.status(400).json({
                message:
                    "Room is already full"
            });
        }

        const [allocationResult] =
            await connection.query(
                `
                INSERT INTO room_allocations
                (
                    student_id,
                    room_id,
                    start_date,
                    status
                )
                VALUES (?, ?, ?, 'active')
                `,
                [
                    student_id,
                    room_id,
                    start_date
                ]
            );

        await connection.query(
            `
            UPDATE rooms
            SET occupied_count =
                occupied_count + 1
            WHERE id = ?
            `,
            [room_id]
        );

        await connection.commit();

        res.status(201).json({

            message:
                "Room allocated successfully",

            allocation: {

                id:
                    allocationResult.insertId,

                student_id,

                student_name:
                    student.name,

                roll_number:
                    student.roll_number,

                room_id:
                    room.id,

                room_number:
                    room.room_number,

                start_date,

                status:
                    "active"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Room allocation error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    } finally {

        connection.release();
    }
};


// =========================================
// GET ALL ALLOCATIONS
// ADMIN / WARDEN
// =========================================

const getAllAllocations = async (req, res) => {
    try {

        const [allocations] =
            await pool.query(
                `
                SELECT
                    room_allocations.id,
                    room_allocations.start_date,
                    room_allocations.end_date,
                    room_allocations.status,

                    students.id AS student_id,
                    students.roll_number,

                    users.name AS student_name,

                    rooms.id AS room_id,
                    rooms.room_number,

                    hostels.id AS hostel_id,
                    hostels.name AS hostel_name

                FROM room_allocations

                INNER JOIN students
                    ON room_allocations.student_id =
                       students.id

                INNER JOIN users
                    ON students.user_id =
                       users.id

                INNER JOIN rooms
                    ON room_allocations.room_id =
                       rooms.id

                INNER JOIN hostels
                    ON rooms.hostel_id =
                       hostels.id

                ORDER BY
                    room_allocations.id DESC
                `
            );

        res.json({

            message:
                "Room allocations retrieved successfully",

            allocations
        });

    } catch (error) {

        console.error(
            "Get allocations error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });
    }
};


// =========================================
// DEALLOCATE ROOM
// ADMIN / WARDEN
// =========================================

const deallocateRoom = async (req, res) => {

    const connection =
        await pool.getConnection();

    try {

        const allocationId =
            req.params.id;

        if (!allocationId) {

            return res.status(400).json({
                message:
                    "Allocation ID is required"
            });
        }

        await connection.beginTransaction();

        const [allocations] =
            await connection.query(
                `
                SELECT
                    room_allocations.id,
                    room_allocations.student_id,
                    room_allocations.room_id,
                    room_allocations.start_date,

                    students.roll_number,

                    users.name AS student_name,

                    rooms.room_number,
                    rooms.occupied_count

                FROM room_allocations

                INNER JOIN students
                    ON room_allocations.student_id =
                       students.id

                INNER JOIN users
                    ON students.user_id =
                       users.id

                INNER JOIN rooms
                    ON room_allocations.room_id =
                       rooms.id

                WHERE room_allocations.id = ?

                AND room_allocations.status = 'active'

                FOR UPDATE
                `,
                [allocationId]
            );

        if (allocations.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Active room allocation not found"
            });
        }

        const allocation =
            allocations[0];

        await connection.query(
            `
            UPDATE room_allocations
            SET
                end_date = CURDATE(),
                status = 'completed'
            WHERE id = ?
            `,
            [allocationId]
        );

        await connection.query(
            `
            UPDATE rooms
            SET occupied_count =
                CASE
                    WHEN occupied_count > 0
                    THEN occupied_count - 1
                    ELSE 0
                END
            WHERE id = ?
            `,
            [allocation.room_id]
        );

        await connection.commit();

        res.json({

            message:
                "Room deallocated successfully",

            allocation: {

                id:
                    allocation.id,

                student_id:
                    allocation.student_id,

                student_name:
                    allocation.student_name,

                roll_number:
                    allocation.roll_number,

                room_id:
                    allocation.room_id,

                room_number:
                    allocation.room_number,

                end_date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                status:
                    "completed"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Room deallocation error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    } finally {

        connection.release();
    }
};


// =========================================
// TRANSFER ROOM
// ADMIN / WARDEN
// =========================================

const transferRoom = async (req, res) => {

    const connection =
        await pool.getConnection();

    try {

        const allocationId =
            req.params.id;

        const {
            new_room_id
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!allocationId || !new_room_id) {

            return res.status(400).json({
                message:
                    "Allocation ID and new room ID are required"
            });
        }


        await connection.beginTransaction();


        // -------------------------------
        // FIND CURRENT ALLOCATION
        // -------------------------------

        const [allocations] =
            await connection.query(
                `
                SELECT

                    room_allocations.id,
                    room_allocations.student_id,
                    room_allocations.room_id,

                    students.roll_number,

                    users.name AS student_name,

                    rooms.room_number AS old_room_number

                FROM room_allocations

                INNER JOIN students
                    ON room_allocations.student_id =
                       students.id

                INNER JOIN users
                    ON students.user_id =
                       users.id

                INNER JOIN rooms
                    ON room_allocations.room_id =
                       rooms.id

                WHERE room_allocations.id = ?

                AND room_allocations.status = 'active'

                FOR UPDATE
                `,
                [allocationId]
            );


        if (allocations.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Active room allocation not found"
            });
        }


        const allocation =
            allocations[0];


        // -------------------------------
        // CHECK SAME ROOM
        // -------------------------------

        if (
            Number(new_room_id) ===
            Number(allocation.room_id)
        ) {

            await connection.rollback();

            return res.status(400).json({
                message:
                    "Student is already in this room"
            });
        }


        // -------------------------------
        // LOCK NEW ROOM
        // -------------------------------

        const [rooms] =
            await connection.query(
                `
                SELECT
                    id,
                    room_number,
                    capacity,
                    occupied_count

                FROM rooms

                WHERE id = ?

                FOR UPDATE
                `,
                [new_room_id]
            );


        if (rooms.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "New room not found"
            });
        }


        const newRoom =
            rooms[0];


        // -------------------------------
        // CHECK NEW ROOM CAPACITY
        // -------------------------------

        if (
            newRoom.occupied_count >=
            newRoom.capacity
        ) {

            await connection.rollback();

            return res.status(400).json({
                message:
                    "New room is already full"
            });
        }


        // -------------------------------
        // UPDATE OLD ROOM
        // -------------------------------

        await connection.query(
            `
            UPDATE rooms

            SET occupied_count =
                CASE
                    WHEN occupied_count > 0
                    THEN occupied_count - 1
                    ELSE 0
                END

            WHERE id = ?
            `,
            [allocation.room_id]
        );


        // -------------------------------
        // UPDATE NEW ROOM
        // -------------------------------

        await connection.query(
            `
            UPDATE rooms

            SET occupied_count =
                occupied_count + 1

            WHERE id = ?
            `,
            [new_room_id]
        );


        // -------------------------------
        // UPDATE ALLOCATION
        // -------------------------------

        await connection.query(
            `
            UPDATE room_allocations

            SET room_id = ?

            WHERE id = ?

            AND status = 'active'
            `,
            [
                new_room_id,
                allocationId
            ]
        );


        await connection.commit();


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({

            message:
                "Room transferred successfully",

            transfer: {

                allocation_id:
                    allocation.id,

                student_id:
                    allocation.student_id,

                student_name:
                    allocation.student_name,

                roll_number:
                    allocation.roll_number,

                old_room_id:
                    allocation.room_id,

                old_room_number:
                    allocation.old_room_number,

                new_room_id:
                    newRoom.id,

                new_room_number:
                    newRoom.room_number,

                status:
                    "active"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Room transfer error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    } finally {

        connection.release();
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    allocateRoom,
    getAllAllocations,
    deallocateRoom,
    transferRoom
};