import { TypeOrmModuleOptions } from '@nestjs/typeorm'
export function getTypeOrmModuleOptions(env: string): TypeOrmModuleOptions {
    if(env==="DEV") {
        return {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'pguser',
            password: 'pgpassword',
            database: 'loja_shtorm',
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
            username: 'pguser',
            password: 'pgpassword',
            database: 'sthore_test',
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true
        }   
    }
}