const catchAsyncError = require("./utils/catchAsyncError");
const client = require("twilio")(
  "AC19227e5e4603b2b173df8012c81e0b34",
  "2985b64a8a573b8326b6d7401f79cf83"
);
const sendMessage = catchAsyncError(async (req, res) => {
  const sendSms = async (body) => {
    let smsOption = {
      from: "+15106626586",
      to: "+8801518394910",
      body: body,
    };
    try {
      const message = await client.messages.create(smsOption);
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  };
  sendSms(`Hello Rasel vai`);
});
sendMessage();
