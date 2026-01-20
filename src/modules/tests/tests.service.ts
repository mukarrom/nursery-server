import { TTest } from "./tests.interface";
import { TestModel } from "./tests.model";

// Service to create a new test in the database.
const createTestService = async (testData: TTest) => {
  const result = await TestModel.create(testData);
  return result;
};

// Service to retrieve tests from the database.
const getTestsService = async () => {
  const result = await TestModel.find();
  return result;
};

// Service to delete a test by ID.
const deleteTestService = async (id: string) => {
  const result = await TestModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Test not found");
  }
  return result;
};



export const TestServices = {
  createTestService,
  getTestsService,
  deleteTestService,
};


