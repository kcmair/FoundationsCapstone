require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    createLocation: (req, res) => {
        const {location} = req.body
        sequelize.query(`
            INSERT INTO locations (name)
            VALUES ('${location}');
        `)
        .then(dbRes => res.status(201).send(dbRes[0]))
        .catch(err => res.send(err))
    },

    createContainer: (req,res) => {
        const {container} = req.body
        sequelize.query(`
            INSERT INTO containers (name)
            VALUES ('${container}');
        `)
        .then(dbRes => res.status(201).send(dbRes[0]))
        .catch(err => res.send(err))
    },

    createSubcontainer: (req, res) => {
        const {subcontainer} = req.body
        sequelize.query(`
            INSERT INTO subcontainers (name)
            VALUES ('${subcontainer}'); 
        `)
        .then(dbRes => res.status(201).send(dbRes[0]))
        .catch(err => res.send(err))
    },

    createJoinTable: (req, res) => {
        const {location, container, subcontainer} = req.body
        sequelize.query(`
            INSERT INTO join_table (location_id, container_id, sub_id)
            VALUES(
                (SELECT id 
                FROM locations
                WHERE name = '${location}'),

                (SELECT id 
                FROM containers
                WHERE name = '${container}'),

                (SELECT id 
                FROM subcontainers
                WHERE name = '${subcontainer}')
            );
        `)
        .then(dbRes => res.status(201).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getLocations: (req, res) => {
        sequelize.query(`
            SELECT * FROM locations;
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getContainers: (req, res) => {
        sequelize.query(`
            SELECT * FROM containers;
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getSubcontainers: (req, res) => {
        sequelize.query(`
            SELECT * FROM subcontainers;
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getJoinTable: (req, res) => {
        sequelize.query(`
            SELECT jt.id jtID, l.name locname, c.name conname, s.name subname
            FROM join_table jt
            JOIN locations l ON jt.location_id = l.id
            JOIN containers c ON jt.container_id = c.id
            JOIN subcontainers s ON jt.sub_id = s.id;
        `)        
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    createItem: (req, res) => {
        const {item, description, joinTableID} = req.body
        sequelize.query(`
            INSERT INTO items (name, description, join_id)
            VALUES ('${item}', '${description}', '${joinTableID}');
        `)
    },

    seeItems: (req, res) => {
        const {location, container, subcon} = req.query
        sequelize.query(`
            SELECT name
            FROM items
            WHERE join_id = (
                SELECT id 
                FROM join_table
                WHERE location_id = (
                    SELECT id 
                    FROM locations
                    WHERE name = '${location}'
                ) AND container_id = (
                    SELECT id
                    FROM containers
                    WHERE name = '${container}'
                ) AND sub_id = (
                    SELECT id
                    FROM subcontainers
                    WHERE name = '${subcon}'
                )
            );        
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    itemTable: (req, res) =>{
        sequelize.query(`
            SELECT * 
            FROM join_table
            WHERE id = (
                SELECT join_id 
                FROM items
                WHERE name = '${req.query.item}'
            );           
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getLocation: (req, res) => {
        sequelize.query(`
            SELECT name
            FROM locations
            WHERE id = ${req.query.location}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getContainer: (req, res) => {
        console.log(req.query.container)
        sequelize.query(`
            SELECT name
            FROM containers
            WHERE id = ${req.query.container}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getSub: (req, res) => {
        console.log(req.query.subcon)
        sequelize.query(`
            SELECT name
            FROM subcontainers
            WHERE id = ${req.query.subcon}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    
}