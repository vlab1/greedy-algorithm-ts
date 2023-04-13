import { Sequelize } from 'sequelize-typescript'

export  const databaseConnection = (...modelSchemas: any[]): any => {
	try {
		const { PGUSER, PGDATABASE, PGPASSWORD, PGPORT, PGHOST } = process.env;
		const sequelize = new Sequelize({
			dialect: "postgres",
			host: PGHOST,
			username: PGUSER,
			password: PGPASSWORD,
			database: PGDATABASE,
			port: Number(PGPORT),
			logging: false,
			models: modelSchemas,
		  }
		)
		
		return sequelize
	} catch (error: any) {
		throw new Error(error.message);
	}
}
