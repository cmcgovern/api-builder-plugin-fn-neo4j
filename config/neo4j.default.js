/*
 * Use this file to configure your Neo4J data connector
 *
 * By default, Neo4J host, username, password and port are environment variables.
 * You may configure them in conf/.env file during development phase.
 * Example setting of environment variables manually:
 * linux/mac: export NEO4J_PASSWORD=password
 * windows: setx NEO4J_PASSWORD 'password'
 */
module.exports = {
	pluginConfig: {
		'api-builder-plugin-fn-neo4j': {
			connectionURL: process.env.NEO4J_HOST,
			database: process.env.NEO4J_DB,
			user: process.env.NEO4J_USER,
			password: process.env.NEO4J_PASSWORD,
			defaultAccessMode: process.env.NEO4J_DEFAULT_ACCESS_MODE
		}
	}
};