export default {
  port: process.env.PORT || 3000,
  dbUrl: {
    dev: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`,
    staging: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=dfsGateway`,
    prod: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=dfsGateway`,
  },
};
// mongodb+srv://ISUserService:5WZoOJYPyJFKIlTN@userservicecluster.spe1x.mongodb.net/?retryWrites=true&w=majority&appName=UserServiceCluster
