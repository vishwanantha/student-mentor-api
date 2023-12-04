import mongoose from "./index.js";

const studentSchema = new mongoose.Schema({
    studentName:{type:String,required:[true,"Student Name is required"]},
    mentorName:{type:String},
    previousMentor:{type:String},
},
{
    versionKey:false
}
)

const studentModel = mongoose.model("students",studentSchema)
export default studentModel