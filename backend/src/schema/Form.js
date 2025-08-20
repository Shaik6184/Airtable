import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema(
  {
    dependsOnFieldId: String,
    operator: { type: String, enum: ['equals', 'not_equals', 'in', 'not_in', 'contains'] },
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    airtableFieldId: String,
    airtableFieldName: String,
    label: String,
    type: { type: String, enum: ['short_text', 'long_text', 'single_select', 'multi_select', 'attachment'] },
    required: { type: Boolean, default: false },
    options: [String],
    conditions: [conditionSchema],
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: String,
    airtable: {
      baseId: String,
      tableId: String,
      tableName: String,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export const Form = mongoose.model('Form', formSchema);


