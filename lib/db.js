// lib/db.js
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    const initial = { users: [], boards: [], tasks: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Users
export function getUserByEmail(email) {
  const db = readDB();
  return db.users.find((u) => u.email === email);
}

export function getUserById(id) {
  const db = readDB();
  return db.users.find((u) => u.id === id);
}

export function addUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
  return user;
}

// Boards
export function getBoardsByUserId(userId) {
  const db = readDB();
  return db.boards.filter((b) => b.userId === userId);
}

export function addBoard(board) {
  const db = readDB();
  db.boards.push(board);
  writeDB(db);
  return board;
}

export function updateBoard(id, updates) {
  const db = readDB();
  const idx = db.boards.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  db.boards[idx] = { ...db.boards[idx], ...updates };
  writeDB(db);
  return db.boards[idx];
}

export function deleteBoard(id) {
  const db = readDB();
  db.boards = db.boards.filter((b) => b.id !== id);
  db.tasks = db.tasks.filter((t) => t.boardId !== id);
  writeDB(db);
  return true;
}

export function getBoardById(id) {
  const db = readDB();
  return db.boards.find((b) => b.id === id);
}

// Tasks
export function getTasksByBoardId(boardId) {
  const db = readDB();
  return db.tasks.filter((t) => t.boardId === boardId);
}

export function getTaskById(id) {
  const db = readDB();
  return db.tasks.find((t) => t.id === id);
}

export function createTask(task) {
  const db = readDB();
  db.tasks.push(task);
  writeDB(db);
  return task;
}

export function updateTask(id, updates) {
  const db = readDB();
  const idx = db.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  db.tasks[idx] = { ...db.tasks[idx], ...updates };
  writeDB(db);
  return db.tasks[idx];
}

export function deleteTask(id) {
  const db = readDB();
  db.tasks = db.tasks.filter((t) => t.id !== id);
  writeDB(db);
  return true;
}
