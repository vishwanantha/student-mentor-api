import mentorModel from "../model/mentor.js";
import studentModel from "../model/student.js";

const createMentor = async (req, res) => {
    try {
        const mentor = await mentorModel.findOne({ mentorName: req.body.mentorName });
        if (!mentor) {
            await mentorModel.create(req.body);

            res.status(201).send({
                message: "Mentor created successfully"
            });
        } else {
            res.status(400).send({
                message: "Mentor already exists."
            });
        }
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}
const assignStudents = async (req, res) => {
    try {
        const mentor = await mentorModel.findOne({ mentorName: req.body.mentorName });
        if (!mentor) {
            return res.status(400).send({
                error: "Mentor not found"
            });
        }
        const students = req.body.students;
        let allStudentsExistAndUnassigned = true;
        for (const studentName of students) {
            const student = await studentModel.findOne({ studentName });
            if (!student || student.mentorName) {
                allStudentsExistAndUnassigned = false;
                break;
            }
        }
        if (!allStudentsExistAndUnassigned) {
            return res.status(400).send({
                error: "Some students you are trying to assign do not exist, or already assigned to a mentor"
            });
        } else {
            const assignments = students.map(async (studentName) => {
                mentor.students.push(studentName);
                await studentModel.updateOne({ studentName }, { mentorName: req.body.mentorName });
            });
            await Promise.all(assignments);
            await mentorModel.updateOne({ mentorName: req.body.mentorName }, { students: mentor.students });
            res.status(201).send({
                message: "Students assigned to mentor successfully"
            });
        }
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}
const allStudentsofParticularMentor = async (req, res) => {
    try {
        const particularMentor = await mentorModel.findOne({ mentorName: req.body.mentorName });

        if (!particularMentor) {
            return res.status(400).send({
                error: "Mentor not found"
            });
        }
        res.status(200).send(particularMentor.students);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}


export default { createMentor,assignStudents,allStudentsofParticularMentor}