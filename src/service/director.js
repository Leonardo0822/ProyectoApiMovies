import { pool } from '../config/db.js'

export default class director {

    static getAllDirectors = async () => {
        const [rows] = await pool.query(`SELECT * FROM directors`)
        return rows
    }

    static findDirector = async (id) => {
        const [rows] = await pool.query(`SELECT * FROM directors WHERE id = ?`, [id])
        return rows[0]
    }

    static createDirector = async (name) => {
            const [result] = await pool.query(
                `INSERT INTO directors (full_name) VALUES (?)`,
                [name]
            )
            return result.insertId
        }

    static updateDirector = async (id, name) => {
            await pool.query(
                `UPDATE directors SET full_name = ? WHERE id = ?`,
                [name, id]
            )
    }

    static deleteDirector = async (id) => {
            await pool.query(
                `DELETE FROM directors WHERE id = ?`,
                [id]
            )
    }
}