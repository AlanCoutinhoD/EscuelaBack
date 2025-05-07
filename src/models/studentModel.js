const pool = require('../config/database');

class Student {
    static async create(studentData) {
        const [result] = await pool.query(
            'INSERT INTO students (nombre, apellido_materno, apellido_paterno, fecha_nacimiento, nivel_educativo, telefono, email, tutor, numero_telefonico_tutor, dia_pago, monto_mensual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                studentData.nombre,
                studentData.apellido_materno,
                studentData.apellido_paterno,
                studentData.fecha_nacimiento,
                studentData.nivel_educativo,
                studentData.telefono,
                studentData.email,
                studentData.tutor,
                studentData.numero_telefonico_tutor,
                studentData.dia_pago,
                studentData.monto_mensual
            ]
        );
        return result;
    }

    static async update(id, studentData) {
        const [result] = await pool.query(
            'UPDATE students SET nombre = ?, apellido_materno = ?, apellido_paterno = ?, fecha_nacimiento = ?, nivel_educativo = ?, telefono = ?, email = ?, tutor = ?, numero_telefonico_tutor = ?, dia_pago = ?, monto_mensual = ? WHERE id = ?',
            [
                studentData.nombre,
                studentData.apellido_materno,
                studentData.apellido_paterno,
                studentData.fecha_nacimiento,
                studentData.nivel_educativo,
                studentData.telefono,
                studentData.email,
                studentData.tutor,
                studentData.numero_telefonico_tutor,
                studentData.dia_pago,
                studentData.monto_mensual,
                id
            ]
        );
        return result;
    }

    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM students');
        return rows;
    }

    static async delete(id) {
        // Primero eliminamos todos los recibos de pago asociados al estudiante
        await pool.query('DELETE FROM payment_receipts WHERE student_id = ?', [id]);
        
        // Luego eliminamos al estudiante
        const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
        return result;
    }

    static async searchStudents(searchParams) {
        let query = 'SELECT * FROM students WHERE 1=1';
        const values = [];

        if (searchParams.nombre) {
            query += ' AND nombre LIKE ?';
            values.push(`%${searchParams.nombre}%`);
        }
        if (searchParams.apellido_paterno) {
            query += ' AND apellido_paterno LIKE ?';
            values.push(`%${searchParams.apellido_paterno}%`);
        }
        if (searchParams.apellido_materno) {
            query += ' AND apellido_materno LIKE ?';
            values.push(`%${searchParams.apellido_materno}%`);
        }
        if (searchParams.nivel_educativo) {
            query += ' AND nivel_educativo = ?';
            values.push(searchParams.nivel_educativo);
        }
        if (searchParams.email) {
            query += ' AND email LIKE ?';
            values.push(`%${searchParams.email}%`);
        }
        if (searchParams.dia_pago) {
            query += ' AND dia_pago = ?';
            values.push(searchParams.dia_pago);
        }

        const [rows] = await pool.query(query, values);
        return rows;
    }
}

module.exports = Student;