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
}