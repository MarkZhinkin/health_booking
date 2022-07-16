export default function createConnectionString(): string {
    return `mongodb://${process.env.DATABASE_IP}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
}
