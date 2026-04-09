CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phoneNumber TEXT
);

CREATE TABLE projets (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  statut TEXT NOT NULL,
  clientId TEXT NOT NULL,
  dateDebut TIMESTAMP NOT NULL,
  dateFin TIMESTAMP,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);
