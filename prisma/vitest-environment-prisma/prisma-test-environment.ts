export default {
  name: "prisma",
  async setup() {
    console.log("Prisma test environment setup");

    return {
      async teardown() {
        console.log("Teadown Prisma test environment");
      },
    };
  },
};
