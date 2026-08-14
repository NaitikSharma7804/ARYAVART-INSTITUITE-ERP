const bcrypt = require('bcrypt');
bcrypt.hash('parent123', 10, (err, hash) => {
    if (err) console.error(err);
    console.log("Your Hash:", hash);
});