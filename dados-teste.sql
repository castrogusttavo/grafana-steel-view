-- Dados de Teste para SteelFlow Monitor
-- Execute este script após criar o schema principal

USE steelflow;

-- Limpar dados existentes (se houver)
TRUNCATE TABLE logs;
TRUNCATE TABLE catalog;
TRUNCATE TABLE root_sensitivity;

-- ========================================
-- INSERIR DADOS DE TESTE: CATALOG
-- ========================================

-- Diretórios raiz
INSERT INTO catalog (item_path_hash, item_path, root_path, item_type, size_bytes, hash_md5, last_seen, synced, sensitive) VALUES
(MD5('E:\\Publica\\DEPARTAMENTOS'), 'E:\\Publica\\DEPARTAMENTOS', 'E:\\Publica\\DEPARTAMENTOS', 'directory', NULL, NULL, NOW(), 0, 0),
(MD5('E:\\Publica\\DEPARTAMENTOS\\Financeiro'), 'E:\\Publica\\DEPARTAMENTOS\\Financeiro', 'E:\\Publica\\DEPARTAMENTOS', 'directory', NULL, NULL, NOW(), 0, 1),
(MD5('E:\\Publica\\DEPARTAMENTOS\\RH'), 'E:\\Publica\\DEPARTAMENTOS\\RH', 'E:\\Publica\\DEPARTAMENTOS', 'directory', NULL, NULL, NOW(), 0, 1),
(MD5('E:\\Publica\\DEPARTAMENTOS\\TI'), 'E:\\Publica\\DEPARTAMENTOS\\TI', 'E:\\Publica\\DEPARTAMENTOS', 'directory', NULL, NULL, NOW(), 0, 0),
(MD5('E:\\Publica\\DEPARTAMENTOS\\Marketing'), 'E:\\Publica\\DEPARTAMENTOS\\Marketing', 'E:\\Publica\\DEPARTAMENTOS', 'directory', NULL, NULL, NOW(), 0, 0);

-- Arquivos diversos (aproximadamente 150.000 para simular o screenshot)
-- Vamos criar um loop para inserir muitos registros de forma eficiente

DELIMITER $$

DROP PROCEDURE IF EXISTS insert_test_files$$
CREATE PROCEDURE insert_test_files()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE dept VARCHAR(50);
  DECLARE file_name VARCHAR(100);
  DECLARE file_path VARCHAR(2048);
  DECLARE file_size BIGINT;
  
  WHILE i <= 1000 DO
    -- Variar departamentos
    SET dept = CASE (i % 5)
      WHEN 0 THEN 'Financeiro'
      WHEN 1 THEN 'RH'
      WHEN 2 THEN 'TI'
      WHEN 3 THEN 'Marketing'
      ELSE 'Geral'
    END;
    
    -- Nome do arquivo
    SET file_name = CONCAT('documento_', LPAD(i, 6, '0'), '.pdf');
    SET file_path = CONCAT('E:\\Publica\\DEPARTAMENTOS\\', dept, '\\', file_name);
    SET file_size = FLOOR(1000000 + (RAND() * 50000000)); -- Entre 1MB e 50MB
    
    -- Inserir arquivo
    INSERT INTO catalog (
      item_path_hash, 
      item_path, 
      root_path, 
      item_type, 
      size_bytes, 
      hash_md5, 
      last_seen, 
      synced, 
      sensitive
    ) VALUES (
      MD5(file_path),
      file_path,
      'E:\\Publica\\DEPARTAMENTOS',
      'file',
      file_size,
      MD5(CONCAT(file_path, i)),
      DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY),
      0,
      IF(dept IN ('Financeiro', 'RH'), 1, 0)
    );
    
    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

-- Executar procedure
CALL insert_test_files();

-- Remover procedure
DROP PROCEDURE insert_test_files;

-- ========================================
-- INSERIR DADOS DE TESTE: ROOT_SENSITIVITY
-- ========================================

INSERT INTO root_sensitivity (root_path, root_hash, sensitive) VALUES
('E:\\Publica\\DEPARTAMENTOS\\Financeiro', MD5('E:\\Publica\\DEPARTAMENTOS\\Financeiro'), 1),
('E:\\Publica\\DEPARTAMENTOS\\RH', MD5('E:\\Publica\\DEPARTAMENTOS\\RH'), 1),
('E:\\Publica\\DEPARTAMENTOS\\TI', MD5('E:\\Publica\\DEPARTAMENTOS\\TI'), 0),
('E:\\Publica\\DEPARTAMENTOS\\Marketing', MD5('E:\\Publica\\DEPARTAMENTOS\\Marketing'), 0);

-- ========================================
-- INSERIR DADOS DE TESTE: LOGS
-- ========================================

-- Logs dos últimos 30 dias
INSERT INTO logs (timestamp, event, path, root_path, details, user_name, ip_address, synced_to_external, flag) VALUES
-- Hoje
(DATE_SUB(NOW(), INTERVAL 4 HOUR), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\TI\\backup.zip', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.100', 0, 0),
(DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Alterado', 'E:\\Publica\\DEPARTAMENTOS\\Marketing\\campanha_2025.pptx', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.100', 0, 0),
(DATE_SUB(NOW(), INTERVAL 6 HOUR), 'Deletado', 'E:\\Publica\\DEPARTAMENTOS\\temp.tmp', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.100', 0, 0),
(DATE_SUB(NOW(), INTERVAL 7 HOUR), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\RH\\folha_pagamento.xlsx', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.101', 0, 1),
(DATE_SUB(NOW(), INTERVAL 8 HOUR), 'Renomeado', 'E:\\Publica\\DEPARTAMENTOS\\Financeiro\\balanco_2024.pdf', 'E:\\Publica\\DEPARTAMENTOS', 'Renomeado de balanco_2023.pdf', 'maria.silva', '192.168.1.102', 0, 1),

-- Ontem  
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\TI\\script.py', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'joao.santos', '192.168.1.103', 0, 0),
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'Alterado', 'E:\\Publica\\DEPARTAMENTOS\\Financeiro\\orcamento.xlsx', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.100', 0, 1),
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\Marketing\\relatorio.docx', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'ana.costa', '192.168.1.104', 0, 0),

-- Última semana
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'Deletado', 'E:\\Publica\\DEPARTAMENTOS\\old_backup.zip', 'E:\\Publica\\DEPARTAMENTOS', 'Arquivo obsoleto removido', 'administrad', '192.168.1.100', 0, 0),
(DATE_SUB(NOW(), INTERVAL 4 DAY), 'Renomeado', 'E:\\Publica\\DEPARTAMENTOS\\TI\\projeto_v2.zip', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'joao.santos', '192.168.1.103', 0, 0),
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\RH\\admissoes_jan.pdf', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'maria.silva', '192.168.1.102', 0, 1),
(DATE_SUB(NOW(), INTERVAL 6 DAY), 'Alterado', 'E:\\Publica\\DEPARTAMENTOS\\Financeiro\\notas_fiscais.xlsx', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'administrad', '192.168.1.100', 0, 1),
(DATE_SUB(NOW(), INTERVAL 7 DAY), 'Criado', 'E:\\Publica\\DEPARTAMENTOS\\Marketing\\newsletter.html', 'E:\\Publica\\DEPARTAMENTOS', NULL, 'ana.costa', '192.168.1.104', 0, 0);

-- Gerar mais logs usando loop
DELIMITER $$

DROP PROCEDURE IF EXISTS insert_test_logs$$
CREATE PROCEDURE insert_test_logs()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE evt VARCHAR(50);
  DECLARE dept VARCHAR(50);
  DECLARE usuario VARCHAR(50);
  DECLARE file_name VARCHAR(100);
  DECLARE file_path VARCHAR(2048);
  DECLARE dias_atras INT;
  
  WHILE i <= 4500 DO
    -- Evento aleatório
    SET evt = CASE (i % 4)
      WHEN 0 THEN 'Criado'
      WHEN 1 THEN 'Alterado'
      WHEN 2 THEN 'Deletado'
      ELSE 'Renomeado'
    END;
    
    -- Departamento aleatório
    SET dept = CASE (i % 5)
      WHEN 0 THEN 'Financeiro'
      WHEN 1 THEN 'RH'
      WHEN 2 THEN 'TI'
      WHEN 3 THEN 'Marketing'
      ELSE 'Geral'
    END;
    
    -- Usuário aleatório
    SET usuario = CASE (i % 4)
      WHEN 0 THEN 'administrad'
      WHEN 1 THEN 'maria.silva'
      WHEN 2 THEN 'joao.santos'
      ELSE 'ana.costa'
    END;
    
    SET file_name = CONCAT('arquivo_', LPAD(i, 6, '0'), '.', IF(RAND() > 0.5, 'pdf', 'xlsx'));
    SET file_path = CONCAT('E:\\Publica\\DEPARTAMENTOS\\', dept, '\\', file_name);
    SET dias_atras = FLOOR(RAND() * 30);
    
    INSERT INTO logs (
      timestamp, 
      event, 
      path, 
      root_path, 
      details, 
      user_name, 
      ip_address, 
      synced_to_external, 
      flag
    ) VALUES (
      DATE_SUB(NOW(), INTERVAL dias_atras DAY),
      evt,
      file_path,
      'E:\\Publica\\DEPARTAMENTOS',
      NULL,
      usuario,
      CONCAT('192.168.1.', FLOOR(100 + (RAND() * 50))),
      0,
      IF(dept IN ('Financeiro', 'RH'), 1, 0)
    );
    
    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

-- Executar procedure
CALL insert_test_logs();

-- Remover procedure
DROP PROCEDURE insert_test_logs;

-- ========================================
-- VERIFICAÇÃO DOS DADOS
-- ========================================

SELECT 'VERIFICAÇÃO DE DADOS INSERIDOS' as INFO;

SELECT 'Total de arquivos:', COUNT(*) FROM catalog WHERE item_type = 'file';
SELECT 'Total de diretórios:', COUNT(*) FROM catalog WHERE item_type = 'directory';
SELECT 'Total de eventos:', COUNT(*) FROM logs;
SELECT 'Total de acessos sensíveis:', COUNT(*) FROM logs WHERE flag = 1;
SELECT 'Armazenamento total:', ROUND(SUM(size_bytes) / 1024 / 1024 / 1024, 2) as 'GB' FROM catalog WHERE item_type = 'file';

SELECT 'Distribuição de eventos:' as INFO;
SELECT event, COUNT(*) as total, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM logs), 1) as percentual
FROM logs
GROUP BY event
ORDER BY total DESC;

SELECT 'Dados inseridos com sucesso!' as RESULTADO;
