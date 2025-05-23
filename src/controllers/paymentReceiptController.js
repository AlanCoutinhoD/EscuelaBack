const PaymentReceipt = require('../models/paymentReceiptModel');

class PaymentReceiptController {
    static async create(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const paymentData = {
                mes_pago: req.body.mes_pago,
                anio_pago: req.body.anio_pago,
                nota: req.body.nota,
                abono: req.body.abono,
                student_id: req.body.student_id,
                total: req.body.total
            };

            const result = await PaymentReceipt.create(paymentData);
            res.status(201).json({ 
                message: 'Payment receipt created successfully',
                receipt_id: result.insertId
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllReceipts(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const receipts = await PaymentReceipt.getAll();
            res.json(receipts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getReceiptById(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const receipt = await PaymentReceipt.getById(req.params.id);
            if (!receipt) {
                return res.status(404).json({ error: 'Receipt not found' });
            }
            res.json(receipt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getReceiptsByStudentAndYear(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const { studentId, year } = req.params;
            
            if (!studentId || !year) {
                return res.status(400).json({ error: 'Se requiere el ID del estudiante y el año' });
            }
            
            const receipts = await PaymentReceipt.getReceiptsByStudentAndYear(studentId, year);
            res.json(receipts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async searchReceipts(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const searchParams = {
                folio: req.query.folio,
                mes_pago: req.query.mes_pago,
                anio_pago: req.query.anio_pago,
                student_id: req.query.student_id,
                nivel_educativo: req.query.nivel_educativo
            };

            const receipts = await PaymentReceipt.searchReceipts(searchParams);
            res.json(receipts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteReceipt(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const { id } = req.params;
            const result = await PaymentReceipt.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Receipt not found' });
            }

            res.json({ message: 'Receipt deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateReceipt(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const { id } = req.params;
            const result = await PaymentReceipt.update(id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Receipt not found' });
            }

            res.json({ message: 'Receipt updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PaymentReceiptController;


const getReceiptsByStudentAndYear = async (req, res) => {
    try {
        const { studentId, year } = req.params;

        const query = `
            SELECT 
                pr.*,
                s.nombre AS student_name,
                s.apellido_paterno,
                s.apellido_materno,
                s.nivel_educativo,
                CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS tutor_nombre,
                pr.fecha_creacion
            FROM payment_receipts pr
            INNER JOIN students s ON pr.student_id = s.id
            LEFT JOIN tutors t ON s.tutor_id = t.id
            WHERE pr.student_id = ? 
            AND YEAR(pr.payment_date) = ?
            ORDER BY pr.payment_date DESC`;

        const [receipts] = await pool.query(query, [studentId, year]);

        if (!receipts.length) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron folios para este estudiante en el año especificado'
            });
        }

        res.json({
            success: true,
            data: receipts
        });

    } catch (error) {
        console.error('Error al obtener los folios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los folios',
            error: error.message
        });
    }
};