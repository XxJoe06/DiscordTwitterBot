(function () {
    process.env.CONSUMER_KEY = "";
    process.env.CONSUMER_SECRET="";
    process.env.ACCESS_TOKEN= "";
    process.env.ACCESS_TOKEN_SECRET = "";
    process.env.BEARER = ""; // Required to use for getting user information when adding a user to the list

    process.env.MONGO_IP = "0.0.0.0";
    process.env.MONGO_PORT = "27017"; // Default MongoDB port

    process.env.DISCORD_TOKEN = "";

    process.env.PREFIX = "$";
})();