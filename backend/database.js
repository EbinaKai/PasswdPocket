// database.js
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // sqliteパッケージを利用

const saltRounds = 10; // bcrypt のソルトの生成に使用するラウンド数

export const setupDatabase = async () => {
  // データベースファイルを開く
  const db = await open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  });

  // ユーザーテーブルの作成
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);

  // ユーザーデータの挿入（パスワードは実際にはハッシュ化するべきです）
  const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'root', password: 'root' }
  ];

  // 各ユーザーに対してINSERT文を実行
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds); // パスワードのハッシュ化
    await db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', [user.username, hashedPassword]);
  }

  // データベースのクローズ（通常はアプリケーションの終了時などに行います）
  await db.close();
};

export const openDb = async () => {
  return open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  });
};