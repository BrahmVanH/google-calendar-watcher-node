import { configDotenv } from 'dotenv';
configDotenv();

const port = process.env.PORT || 4000;

const server = new ApolloDServerDev({
	typeDefs,
	resolvers,
	introspection: true,
});
console.log('Starting server', server);

server.listen({ port }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
