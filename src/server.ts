import dotenv from 'dotenv';
import express from 'express';
import env from 'env-var';
import router from './routes';
import databaseHelper from '@/loaders/database';


const app = express();
dotenv.config();


const port = env.get('PORT').required().asPortNumber();
const NODE_ENV = env.get('NODE_ENV').default('development').asString();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Iniciar conexões com o banco de dados
databaseHelper.initConnections()

app.use('/api', router);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} - Ambiente: ${NODE_ENV}`);
});
