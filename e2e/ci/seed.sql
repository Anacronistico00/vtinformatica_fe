-- Dati minimi che gli E2E si aspettano dopo `dotnet ef database update` del BE (job CI "e2e").
-- Li crea il seed (HasData) delle migration: questo script non inserisce nulla, verifica e
-- fallisce con un messaggio chiaro se mancano, invece di lasciare errori oscuri nei test.
SET NOCOUNT ON;

IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Id = '98b4e551-a53d-40fc-9fa4-29d6dd582481' AND Name = 'Admin')
    THROW 50001, 'Seed mancante: ruolo Admin con l''id fisso atteso da e2e/support/env.js.', 1;

IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'Customer')
    THROW 50002, 'Seed mancante: ruolo Customer.', 1;

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Id = 1)
    OR NOT EXISTS (SELECT 1 FROM SubCategories WHERE Id = 1)
    THROW 50003, 'Seed mancante: categoria e sottocategoria con id 1 (usate per i prodotti E2E).', 1;

IF NOT EXISTS (SELECT 1 FROM Manufacturers WHERE ManufacturerId = 1)
    THROW 50004, 'Seed mancante: produttore con id 1 (usato per i prodotti E2E).', 1;

SELECT 'seed ok' AS result;
