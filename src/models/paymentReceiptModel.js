const pool = require('../config/database');

class PaymentReceipt {
    static async create(paymentData) {
        const folio = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const [result] = await pool.query(
            'INSERT INTO payment_receipts (folio, mes_pago, anio_pago, nota, abono, student_id, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                folio,
                paymentData.mes_pago,
                paymentData.anio_pago,
                paymentData.nota,
                paymentData.abono,
                paymentData.student_id,
                paymentData.total
            ]
        );
        return result;
    }

    static async searchReceipts(searchParams) {
        let query = `
            SELECT p.*, s.nombre, s.apellido_paterno, s.apellido_materno, s.nivel_educativo 
            FROM payment_receipts p 
            JOIN students s ON p.student_id = s.id 
            WHERE 1=1
        `;
        const values = [];

        if (searchParams.folio) {
            query += ' AND p.folio LIKE ?';
            values.push(`%${searchParams.folio}%`);
        }
        if (searchParams.mes_pago) {
            query += ' AND p.mes_pago = ?';
            values.push(searchParams.mes_pago);
        }
        if (searchParams.anio_pago) {
            query += ' AND p.anio_pago = ?';
            values.push(searchParams.anio_pago);
        }
        if (searchParams.student_id) {
            query += ' AND p.student_id = ?';
            values.push(searchParams.student_id);
        }
        if (searchParams.nivel_educativo) {
            query += ' AND s.nivel_educativo = ?';
            values.push(searchParams.nivel_educativo);
        }

        const [rows] = await pool.query(query, values);
        return rows;
    }

    static async getAll() {
        const [rows] = await pool.query(`
            SELECT 
                pr.*,
                s.nombre,
                s.apellido_paterno,
                s.apellido_materno,
                s.nivel_educativo,
                s.tutor,
                s.numero_telefonico_tutor
            FROM payment_receipts pr 
            JOIN students s ON pr.student_id = s.id
            ORDER BY pr.fecha_creacion DESC
        `);
        return rows;
    }

    static async getReceiptsByStudentAndYear(studentId, year) {
        const [rows] = await pool.query(`
            SELECT 
                pr.*,
                s.nombre,
                s.apellido_paterno,
                s.apellido_materno,
                s.nivel_educativo,
                s.tutor,
                s.numero_telefonico_tutor
            FROM payment_receipts pr 
            JOIN students s ON pr.student_id = s.id
            WHERE pr.student_id = ? AND pr.anio_pago = ?
            ORDER BY pr.fecha_creacion DESC
        `, [studentId, year]);
        return rows;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM payment_receipts WHERE id = ?', [id]);
        return result;
    }
}

module.exports = PaymentReceipt;