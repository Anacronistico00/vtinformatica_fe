import { execFileSync } from 'node:child_process';
import { SQLCMD, SQL_DATABASE, SQL_SERVER } from './env.js';

/** Esegue SQL sul DB locale con sqlcmd (autenticazione Windows). -b: esce con errore se lo script fallisce. */
export const runSql = (sql) =>
  execFileSync(SQLCMD, ['-S', SQL_SERVER, '-E', '-C', '-d', SQL_DATABASE, '-b', '-h', '-1', '-W', '-Q', `SET NOCOUNT ON; ${sql}`], {
    encoding: 'utf8',
  }).trim();

// Rimuove SOLO i dati di test (utenti e2e.*@example.test, prodotti "E2E ..."), in un'unica transazione.
// L'ordine rispetta le FK: righe d'ordine e carrelli prima di prodotti e utenti.
const CLEANUP = `
BEGIN TRANSACTION;
DECLARE @users TABLE (Id nvarchar(450));
INSERT @users SELECT Id FROM AspNetUsers WHERE Email LIKE 'e2e.%@example.test';
DECLARE @products TABLE (Id int);
INSERT @products SELECT Id FROM Products WHERE Name LIKE 'E2E %';
DECLARE @orders TABLE (Id int);
INSERT @orders SELECT Id FROM Orders WHERE CustomerId IN (SELECT Id FROM @users);

IF EXISTS (SELECT 1 FROM OrderItem oi WHERE oi.ProductId IN (SELECT Id FROM @products) AND oi.OrderId NOT IN (SELECT Id FROM @orders))
BEGIN
  ROLLBACK TRANSACTION;
  THROW 50001, 'Prodotti E2E presenti in ordini non di test: pulizia annullata.', 1;
END

DELETE FROM Reviews WHERE UserId IN (SELECT Id FROM @users) OR ProductId IN (SELECT Id FROM @products);
DELETE FROM OrderItem WHERE OrderId IN (SELECT Id FROM @orders);
DELETE FROM Orders WHERE Id IN (SELECT Id FROM @orders);
DELETE FROM CartItems WHERE CartId IN (SELECT Id FROM Carts WHERE UserId IN (SELECT Id FROM @users))
  OR ProductId IN (SELECT Id FROM @products);
DELETE FROM Carts WHERE UserId IN (SELECT Id FROM @users);
DELETE FROM ProductImages WHERE ProductId IN (SELECT Id FROM @products);
DELETE FROM Products WHERE Id IN (SELECT Id FROM @products);
DELETE FROM AspNetUserRoles WHERE UserId IN (SELECT Id FROM @users);
DELETE FROM AspNetUserClaims WHERE UserId IN (SELECT Id FROM @users);
DELETE FROM AspNetUserLogins WHERE UserId IN (SELECT Id FROM @users);
DELETE FROM AspNetUserTokens WHERE UserId IN (SELECT Id FROM @users);
DELETE FROM AspNetUsers WHERE Id IN (SELECT Id FROM @users);
COMMIT TRANSACTION;
`;

export const cleanupTestData = () => runSql(CLEANUP);

export const countTestData = () =>
  runSql(
    "SELECT CAST((SELECT COUNT(*) FROM AspNetUsers WHERE Email LIKE 'e2e.%@example.test') AS varchar) + ' ' + " +
      "CAST((SELECT COUNT(*) FROM Products WHERE Name LIKE 'E2E %') AS varchar)"
  );

export const setStock = (productId, quantity) =>
  runSql(`UPDATE Products SET Quantity = ${Number(quantity)} WHERE Id = ${Number(productId)} AND Name LIKE 'E2E %'`);
