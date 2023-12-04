import mentorModel from "../model/mentor.js"
import studentModel from "../model/student.js"


const createStudent = async (req, res) => {
    try {
        if (req.body.studentName) {
            let student = await studentModel.findOne({ studentName: req.body.studentName });
            if (!student) {
                await studentModel.create(req.body);
                res.status(201).send({
                    message: "Student created successfully"
                });
            } else {
                res.status(400).send({
                    message: "Student already registered."
                });
            }
        } else {
            res.status(400).send({
                message: "StudentName is required."
            });
        }
    } catch (error) {
        res.status(400).send({
            error: error
        });
    }
};


const assignChangeMentor = async (req, res) => {
    try {
        // Check if the student exists
        const student = await studentModel.findOne({ studentName: req.body.studentName });
        if (!student) {
            return res.status(400).send({
                error: "Student not found"
            });
        }
        // Check if the new mentor exists
        const newMentor = await mentorModel.findOne({ mentorName: req.body.newMentorName });
        if (!newMentor) {
            return res.status(400).send({
                error: "New mentor not found"
            });
        }
        // Check if the student is already assigned to the new mentor
        if (newMentor.students.includes(req.body.studentName)) {
            return res.status(400).send({
                error: "Student is already assigned to the new mentor"
            });
        }
        // Find the old mentor
        const oldMentor = await mentorModel.findOne({ mentorName: student.mentorName });
        // Set the previous mentor for the student before the mentor change
        const previousMentor = student.mentorName;
        // Assign the new mentor to the student and update the previous mentor
        await studentModel.updateOne(
            { studentName: req.body.studentName },
            { mentorName: req.body.newMentorName, previousMentor: previousMentor }
        );
        // Update the new mentor's student list
        newMentor.students.push(req.body.studentName);
        await mentorModel.updateOne({ mentorName: req.body.newMentorName }, { students: newMentor.students });
        // Remove the student from the old mentor's student list
        oldMentor.students = oldMentor.students.filter(studentName => studentName !== req.body.studentName);
        await mentorModel.updateOne({ mentorName: oldMentor.mentorName }, { students: oldMentor.students });
        res.status(201).send({
            message: "Changed mentor successfully"
        });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}

const getPreviousMentor = async (req, res) => {
    try {
        // Check if the student name is provided in the request body
        const studentName = req.body.studentName;
        if (!studentName) {
            return res.status(400).send({
                error: "Student name is required in the request body"
            });
        }
        // Check if the student exists
        const student = await studentModel.findOne({ studentName });
        if (!student) {
            return res.status(400).send({
                error: "Student not found"
            });
        }
        // If the student has a previous mentor, find and return it
        if (student.previousMentor) {
            const previousMentor = await mentorModel.findOne({ mentorName: student.previousMentor });
            if (previousMentor) {
                return res.status(200).send({
                    previousMentor: previousMentor.mentorName
                });
            } else {
                return res.status(200).send({
                    previousMentor: "Previous mentor not found"
                });
            }
        } else {
            // If the student is assigned to their first mentor
            return res.status(200).send({
                previousMentor: "This is the first mentor"
            });
        }
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}

export default {
    createStudent,
    assignChangeMentor,
    getPreviousMentor
}