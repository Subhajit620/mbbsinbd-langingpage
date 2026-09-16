import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    report_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, default: '' },
    query: { type: String, default: '' },
    neet_score: { type: Number, required: true },
    passing_year: { type: String, required: true },
    marks_10: { type: Object, required: true },
    marks_12: { type: Object, required: true },
    calculated_gpa_10: { type: Number, required: true },
    calculated_gpa_12: { type: Number, required: true },
    is_eligible: { type: Boolean, required: true },
    pdf_url: { type: String, required: true },
    submitted_at: { type: Date, default: Date.now }
  },
  {
    collection: 'leads',
    timestamps: false
  }
);

export default mongoose.model('Lead', leadSchema);
