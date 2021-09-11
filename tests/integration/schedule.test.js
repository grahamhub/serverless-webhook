import { schedule, data } from "@serverless/cloud";
import { expect, jest, test } from "@jest/globals";

const log = jest.spyOn(console, "log");

beforeAll(async () => {
  await data.set(
    "todo:456",
    {
      id: "456",
      name: "Overdue item",
      status: "incomplete",
    },
    {
      label1: "incomplete:1900-06-30",
    }
  );
});

afterAll(async () => {
  await data.remove("todo:456");
});

test("alerts on overdue items", async () => {
  await schedule.every("60 minutes").invoke();

  expect(log).toBeCalledWith("ALERT: 'Overdue item' is overdue!!!");
});

test("alerts on incomplete items", async () => {
  await schedule.every("2 hours").invoke();

  expect(log).toBeCalledWith("Incomplete todos:\n- Overdue item\n");
});
