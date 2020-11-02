const neo4j = require('neo4j-driver');

let neo4jDriver;

async function ensureConnection(options, logger) {
	if (neo4jDriver) {
		return neo4jDriver;
	} else {
		try {
			var neo4jDriver = neo4j.driver(
				options.pluginConfig.connectionURL,
				neo4j.auth.basic(options.pluginConfig.user, options.pluginConfig.password)
			)
			
			options.logger.info(`Connected to ${options.pluginConfig.connectionURL}`);
		} catch (ex) {
			options.logger.error(`Failed to connect to Neo4J database: ${options.pluginConfig.connectionURL}. Make sure Neo4J server is running and conf/neo4j.default.js is configured`);
		}
	}
	
	return neo4jDriver;
}

/**
 * Action method.
 *
 * @param {object} params - A map of all the parameters passed from the flow.
 * @param {object} options - The additional options provided from the flow
 *	 engine.
 * @param {object} options.pluginConfig - The service configuration for this
 *	 plugin from API Builder config.pluginConfig['api-builder-plugin-pluginName']
 * @param {object} options.logger - The API Builder logger which can be used
 *	 to log messages to the console. When run in unit-tests, the messages are
 *	 not logged.  If you wish to test logging, you will need to create a
 *	 mocked logger (e.g. using `simple-mock`) and override in
 *	 `MockRuntime.loadPlugin`.  For more information about the logger, see:
 *	 https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/logging.html
 * @param {*} [options.pluginContext] - The data provided by passing the
 *	 context to `sdk.load(file, actions, { pluginContext })` in `getPlugin`
 *	 in `index.js`.
 * @return {*} The response value (resolves to "next" output, or if the method
 *	 does not define "next", the first defined output).
 */
async function sendCipher(params, options) {
	const { name } = params;
	const { logger } = options;
	
	let records;
	
	connection = await ensureConnection(options, logger);
	neo4JSession = await connection.session({ defaultAccessMode: neo4j.session.READ });
	
	const query = params.query;

	// the Promise way, where the complete result is collected before we act on it:
	await neo4JSession
		.run(query, {})
		.then(result => {
			options.logger.debug("Received records" + JSON.stringify(result));
			records = result.records;
		})
		.catch(error => {
			throw new Error(error);
		})
		.then(() => neo4JSession.close())

	return records;
}

module.exports = {
	sendCipher
};
