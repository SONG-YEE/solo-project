const { pool } = require("../../config/database");


// 로그인 (회원 검증)
exports.isValidUsers = async function(connection, userID, password) {
  const Query = `SELECT userIdx, nickname FROM Users WHERE userID = ? AND password = ? AND status = 'A';`;
  const Params = [userID, password];
  
  const rows = await connection.query(Query, Params);
  
  return rows;
  
};


// DB 회원 검증(중복 아이디 확인)
exports.checkID = async function (connection, userID) {
  const Query = `SELECT userID FROM Users WHERE userID = ? AND status = 'A';`;
  const Params = [userID];

  const rows = await connection.query(Query, Params);

  return rows;
  
  };
  
  
// DB 회원 검증(중복 닉네임 확인)
exports.checkNick = async function (connection, nickname) {
  const Query = `SELECT nickname FROM Users WHERE nickname = ? AND status = 'A';`;
  const Params = [nickname];

  const rows = await connection.query(Query, Params);

  return rows;
    
};


// 회원 가입
exports.insertUsers = async function(connection, userID, password, nickname) {
    const Query = `INSERT INTO Users(userID, password, nickname) VALUES(?, ?, ?);`;
    const Params = [userID, password, nickname];
    
    const rows = await connection.query(Query, Params);

    return rows;

};


// 카테고리별 식당 조회
exports.selectRestaurants = async function(connection, category) {
  const selectAllRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants WHERE status = 'A';`;
  const selectCategorizedRestaurantsQuery = `SELECT title, address, category, videoUrl FROM Restaurants WHERE status = 'A' AND category = ?;`;
  
  const Params = [category];

  const Query = category ? selectCategorizedRestaurantsQuery : selectAllRestaurantsQuery

  
  const rows = await connection.query(Query, Params);

  return rows;

};