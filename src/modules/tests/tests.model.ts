import { model, Schema } from "mongoose";
import { TTest } from "./tests.interface";

const testSchema = new Schema<TTest>(
  {
    title: {
      type: String,
    },
    test: {
      type: String,
    },
  },
  { timestamps: true }
);

export const TestModel = model<TTest>("test", testSchema);
