import { pool } from '../config/db.js'

export default class genre {

static create = async (name) => {
        const [result] = await pool.query(
            `INSERT INTO genres (name) VALUES (?)`,
            [name]
        )
        return result.insertId


}