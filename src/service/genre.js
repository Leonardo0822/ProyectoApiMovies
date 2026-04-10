import { pool } from '../config/db.js'

export default class genre {

    static getAllGenres = async () => {
        const [rows] = await pool.query(`SELECT * FROM genres`)
        return rows
    }
    
    static findGenre = async (id) => {
        const [rows] = await pool.query(`SELECT * FROM genres WHERE id = ?`, [id])
        return rows[0]
    }

    static createGenre = async (name) => {
            const [result] = await pool.query(
                `INSERT INTO genres (name) VALUES (?)`,
                [name]
            )
            return result.insertId

        }

    static updateGenre = async (id, name) => {
            await pool.query(
                `UPDATE genres SET name = ? WHERE id = ?`,
                [name, id]
            )
    }

    static deleteGenre = async (id) => {
            await pool.query(
                `DELETE FROM genres WHERE id = ?`,
                [id]
            )
    }
}