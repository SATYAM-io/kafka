import { kafkaClient } from "./kafka-client";

async function setup() {
  const admin = kafkaClient.admin();
  console.log(`kafka admin connecting...`);
  await admin.connect();
  console.log(`kafka admin connecting success...`);

  await admin.createTopics({
    topics: [
      {
        topic: "location-updates",
        numPartitions: 2,
      },
    ],
  });

  await admin.disconnect()
}
