import { TypeOrmModuleOptions } from '@nestjs/typeorm'
export function getTypeOrmModuleOptions(env: string): TypeOrmModuleOptions {
    if(env==="DEV") {
        return {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: process.env.PGUSER,
            password: process.env.PGPASS,
            database: process.env.PGDB,
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true
        }
    }
    if (env==="TEST") {
        return {
            dropSchema: true,
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: process.env.PGUSER,
            password: process.env.PGPASS,
            database: process.env.PGDB,
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true
        }   
    }

    if (env==='PROD') {
        return {
            dropSchema: true,
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true
        } 
    }
}