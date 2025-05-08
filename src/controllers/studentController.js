const Student = require('../models/studentModel');

class StudentController {
    static async create(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const studentData = {
                nombre: req.body.nombre,
                apellido_materno: req.body.apellido_materno,
                apellido_paterno: req.body.apellido_paterno,
                fecha_nacimiento: req.body.fecha_nacimiento,
                nivel_educativo: req.body.nivel_educativo,
                telefono: req.body.telefono,
                email: req.body.email,
                tutor: req.body.tutor,
                numero_telefonico_tutor: req.body.numero_telefonico_tutor,                dia_pago: req.body.dia_pago,
                monto_mensual: req.body.monto_mensual,
                fecha_registro: req.body.fecha_registro,
                hora_registro: req.body.hora_registro
            };

            const result = await Student.create(studentData);
            res.status(201).json({ message: 'Student created successfully', id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllStudents(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const students = await Student.getAll();
            res.json(students);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateStudent(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const id = req.params.id;
            const studentData = {
                nombre: req.body.nombre,
                apellido_materno: req.body.apellido_materno,
                apellido_paterno: req.body.apellido_paterno,
                fecha_nacimiento: req.body.fecha_nacimiento,
                nivel_educativo: req.body.nivel_educativo,
                telefono: req.body.telefono,
                email: req.body.email,
                tutor: req.body.tutor,
                numero_telefonico_tutor: req.body.numero_telefonico_tutor,
                dia_pago: req.body.dia_pago,
                monto_mensual: req.body.monto_mensual,
                fecha_registro: req.body.fecha_registro,
                hora_registro: req.body.hora_registro
            };

            await Student.update(id, studentData);
            res.json({ message: 'Student updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteStudent(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const { id } = req.params;
            const result = await Student.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }

            res.json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async searchStudents(req, res) {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }

            const searchParams = {
                nombre: req.query.nombre,
                apellido_paterno: req.query.apellido_paterno,
                apellido_materno: req.query.apellido_materno,
                nivel_educativo: req.query.nivel_educativo,
                email: req.query.email,
                dia_pago: req.query.dia_pago
            };

            const students = await Student.searchStudents(searchParams);
            res.json(students);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = StudentController;