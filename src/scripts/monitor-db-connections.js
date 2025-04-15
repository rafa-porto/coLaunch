/**
 * Script para monitorar e gerenciar conexões com o banco de dados PostgreSQL
 * 
 * Este script pode ser executado para verificar o número de conexões ativas
 * e encerrar conexões ociosas se necessário.
 */

require('dotenv').config();
const { Pool } = require('pg');

// Criar um pool de conexões para consultas administrativas
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});

async function monitorConnections() {
  const client = await pool.connect();
  
  try {
    console.log('Verificando conexões com o banco de dados...');
    
    // Consultar conexões ativas
    const activeConnectionsResult = await client.query(`
      SELECT count(*) as count 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);
    
    const activeConnections = activeConnectionsResult.rows[0].count;
    console.log(`Conexões ativas: ${activeConnections}`);
    
    // Consultar conexões ociosas
    const idleConnectionsResult = await client.query(`
      SELECT count(*) as count 
      FROM pg_stat_activity 
      WHERE datname = current_database() 
      AND state = 'idle'
    `);
    
    const idleConnections = idleConnectionsResult.rows[0].count;
    console.log(`Conexões ociosas: ${idleConnections}`);
    
    // Verificar se há muitas conexões ociosas
    if (idleConnections > 5) {
      console.log('Encerrando conexões ociosas...');
      
      // Encerrar conexões ociosas com mais de 1 hora
      await client.query(`
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = current_database() 
        AND state = 'idle' 
        AND current_timestamp - state_change > interval '1 hour'
      `);
      
      console.log('Conexões ociosas encerradas.');
    }
    
    // Verificar configuração do banco de dados
    const maxConnectionsResult = await client.query('SHOW max_connections');
    const maxConnections = maxConnectionsResult.rows[0].max_connections;
    console.log(`Máximo de conexões permitidas: ${maxConnections}`);
    
    // Calcular porcentagem de uso
    const usagePercentage = (activeConnections / maxConnections) * 100;
    console.log(`Uso atual: ${usagePercentage.toFixed(2)}%`);
    
    if (usagePercentage > 80) {
      console.log('ALERTA: Uso de conexões está alto!');
    }
    
  } catch (error) {
    console.error('Erro ao monitorar conexões:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar o monitoramento
monitorConnections().catch(console.error);
