const { pool } = require("../../config/database");

// 예시 코드
exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Students;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.selectRestaurants = async function(connection, category) {
  const selectAllRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants WHERE status = 'A';`;
  const selectCategorizedRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants WHERE status = 'A' AND category = ?;`;
  
  const Params = [category];

  const Query = category ? selectCategorizedRestaurantsQuery : selectAllRestaurantsQuery

  
  const rows = await connection.query(Query, Params);

  return rows;
};


exports.insertUsers = async function(connection, userID, password, nickname) {
    const Query = `INSERT INTO Users(userID, password, nickname) VALUES(?, ?, ?);`;
    const Params = [userID, password, nickname];
    
    const rows = await connection.query(Query, Params);

    return rows;

  };


  exports.isValidUsers = async function(connection, userID, password) {
    const Query = `SELECT userIdx, nickname FROM Users WHERE userID = ? AND password = ? AND status = 'A';`;
    const Params = [userID, password];

    const rows = await connection.query(Query, Params);

    return rows;
  };