import mongoose from "./index.js";


const mentorSchema = new mongoose.Schema(
    {
        mentorName: { type: String, required: [true, "Mentor Name is required"] },
        students: { type:String }
    },
    {
        versionKey: false
    }
)

const mentorModel = mongoose.model("mentors", mentorSchema)
export default mentorModel