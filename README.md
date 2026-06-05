# Progetto Ingegneria dei Sistemi Web 2025/2026

Link Repository Github: [Gestionale-Estetista](https://github.com/Nick-2002b/Gestionale-Estetista)

## Indice dei contenuti

1. Introduzione
2. Scelte Architetturali e di Design Pattern
3. Funzionalità dell'Applicazione
4. Tecnologie Utilizzate e Pacchetti
5. Struttura del Progetto e Database
6. API Endpoints
7. Design, UI/UX e Accessibilità
8. Installazione e Documentazione

## 1. Introduzione

Questa applicazione web è un sistema gestionale su misura sviluppato per l'amministrazione e l'organizzazione di un centro estetico. L'idea progettuale nasce da una reale esigenza lavorativa: la titolare del centro gestiva la complessa rete di appuntamenti, clienti e listini prezzi interamente su un'agenda cartacea.

L'obiettivo del progetto è stato la digitalizzazione completa di questo processo. Durante l'intero ciclo di sviluppo (SDLC), è stato adottato un approccio Agile, interface (UI), garantendo che il prodotto finale fosse non solo tecnicamente solido, ma anche intuitivo, rapido da usare durante le ore di lavoro e perfettamente aderente alle necessità del business.

Il sistema è progettato per un utilizzo centralizzato (Single-User/Admin), in modo da dare al gestore il controllo totale su appuntamenti, clienti e listino prezzi.

## 2. Scelte Architetturali e di Design Pattern

Per garantire scalabilità, sicurezza e manutenibilità al codice, sono state prese decisioni architetturali specifiche distaccandosi dagli approcci più basilari:

- **Architettura MVC:** Il server Node.js/Express è stato strutturato seguendo il pattern Model-View-Controller per mantenere le API pulite e facilmente estendibili.
- **State Management Centralizzato (Single Source of Truth):** Per evitare l'anti-pattern del _Props Drilling_ nel frontend, è stato adottato **Pinia**. Questo ha permesso di disaccoppiare la logica di business dalla grafica. Ad esempio, quando viene creato un nuovo appuntamento, i dati vengono inviati al backend e lo Store globale viene aggiornato; il componente Calendario, essendo reattivo, si aggiorna istantaneamente.
- **Integrazione Vue Slots (Frontend):** Per personalizzare pesantemente librerie esterne (come FullCalendar), è stato fatto un uso avanzato degli _Scoped Slots_ (`v-slot:eventContent`). Questo ha permesso di "bucare" il rendering nativo della libreria, demandando a FullCalendar i calcoli temporali complessi e delegando a Vue e Tailwind il rendering puramente estetico delle "Card" degli appuntamenti.
- **Autenticazione e Sicurezza:** Il sistema di login utilizza JSON Web Tokens (JWT) trasmessi in modo sicuro tramite cookie `HttpOnly`.

## 3. Funzionalità dell'Applicazione

Tutte le funzionalità sono accessibili dal gestore. Le feature principali includono:

**Gestione Agenda (Calendario Interattivo):**

- Visualizzazione degli appuntamenti tramite un calendario interattivo (vista giornaliera, settimanale e mensile).
- **Custom Rendering:** Ogni trattamento ha un colore esadecimale assegnato per essere riconosciuto al volo nel calendario.
- Creazione, modifica ed eliminazione degli appuntamenti tramite finestre modali.
- Calcolo automatico dell'orario di fine appuntamento basato sulla somma delle durate dei singoli trattamenti scelti, supportato da logiche utilitaristiche implementate in TypeScript.

**Gestione Clienti:**

- Tabella responsive contenente l'anagrafica dei clienti.
- Ricerca in tempo reale per nome, email o telefono e ordinamento dati.
- Operazioni CRUD (Creazione, Lettura, Modifica, Eliminazione) complete.

**Gestione Trattamenti e Categorie:**

- Listino digitale con visualizzazione a griglia.
- Classificazione dinamica dei trattamenti in categorie (es. Mani, Viso, Corpo).
- Implementazione della logica di _Soft-Delete_ (attivazione/disattivazione) sui trattamenti:
  - disattivare un trattamento lo rende non selezionabile dal menu select per i nuovi appuntamenti, ma ne mantiene l'integrità referenziale nello storico passato.
- Assegnazione di un colore esadecimale identificativo per ogni trattamento, per il riconoscimento immediato in agenda.

## 4. Tecnologie Utilizzate e Pacchetti

**Stack Frontend:**

- **Vue.js**
- **TypeScript**
- **Vite**
- **Pinia**
- **Tailwind CSS v4**
- **FullCalendar**
- **axios**
- **vue-router**

**Stack Backend:**

- **Node.js**
- **Express.js**
- **SQLite**
- **jsonwebtoken**
- **bcrypt**
- **cookie-parser**

## 5. Struttura del Progetto e Database

Il progetto è strutturato in un **monorepo logico** suddiviso in due macro-cartelle:

- **`frontend/`**: Contiene l'applicativo Vue strutturato in:
  - `src/pages/`: Le viste principali dell'app (es. `Agenda.vue`, `Clients.vue`).
  - `src/components/`: Componenti modulari e riutilizzabili (es. `BaseModal.vue`, `ConfirmDialog.vue`).
  - `src/stores/`: Gestione globale dello stato tramite Pinia.
  - `src/layouts/` e `src/utils/`: Layout strutturali e funzioni di utility (come il `timeCalculator.ts`).
- **`backend/`**: Contiene il server Express organizzato secondo il pattern MVC: `src/routes`, `src/controllers`, `src/models`, `src/middlewares` (incluso il controllo JWT) e `src/config` (per l'inizializzazione del DB).

**Progettazione Database (SQLite):**
Il database relazionale è normalizzato (implementando le Foreign Keys) e composto da **6 tabelle principali**:

1. `users`: Dati di accesso e ruoli (Admin).
2. `clients`: Anagrafica dei clienti del centro.
3. `categories`: Categorie per il raggruppamento logico dei trattamenti.
4. `treatments`: Catalogo dei servizi offerti (con chiave esterna `category_id`).
5. `appointments`: eventi a calendario (con chiave esterna `client_id`).
6. `appointment_treatments`: Tabella ponte che risolve la relazione Molti-a-Molti tra appuntamenti e trattamenti. È dotata di una chiave primaria surrogata autonoma per permettere di registrare lo stesso trattamento più volte all'interno della medesima seduta.

## 6. API Endpoints

### GET

- `/api/auth/me` - Validazione sessione e recupero dati utente
- `/api/clients/` - Lista di tutti i clienti
- `/api/treatments/` - Lista di tutti i trattamenti
- `/api/treatments/categories` - Lista delle categorie
- `/api/appointments/` - Lista di tutti gli appuntamenti

### POST

- `/api/auth/login` - Login e rilascio cookie
- `/api/auth/register` - Registrazione utente
- `/api/auth/logout` - Distruzione sessione
- `/api/clients/` - Creazione di un nuovo cliente
- `/api/clients/:id` - Modifica anagrafica cliente
- `/api/treatments/` - Creazione di un nuovo trattamento
- `/api/treatments/:id` - Modifica dei dati di un trattamento
- `/api/treatments/:id/status` - (Soft Delete) Modifica stato di attivazione di un trattamento
- `/api/treatments/categories` - Creazione di una categoria
- `/api/treatments/categories/:id` - Modifica di una categoria
- `/api/appointments/` - Creazione di un nuovo appuntamento
- `/api/appointments/:id` - Modifica di un appuntamento

### DELETE

- `/api/clients/:id` - Eliminazione cliente
- `/api/treatments/:id` - Eliminazione definitiva di un trattamento
- `/api/treatments/categories/:id` - Eliminazione di una categoria
- `/api/appointments/:id` - Eliminazione di un appuntamento

## 7. Design, UI/UX e Accessibilità

Il design system è stato strutturato lavorando fianco a fianco con l'utente finale, orientandosi verso la massima pulizia visiva e operatività sul campo.

- **Prototipazione su Figma:** Prima della stesura del codice, il layout e i flussi di navigazione sono stati interamente disegnati su [Figma](https://www.figma.com/proto/5AeDJprI9MUgyv6FYovT8t/MockUp-Gestionale?node-id=2040-3265&p=f&t=TqymJivjaKn1iwri-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2040%3A3265). Questo ha permesso di definire un design system coerente e di ricevere feedback immediati dall'utente finale sulle interfacce (es. le modali o il calendario).
- **Minimalismo Costruttivo:** Il layout sfrutta i sistemi CSS Grid e Flexbox di Tailwind per dividere logicamente gli spazi (es. Sidebar laterale e area di lavoro principale).
- **Componentizzazione e DRY:** Ampio utilizzo di logiche modulari. Modali come `BaseModal.vue` agiscono come wrapper per iniettare contenuti eterogenei mantenendo una coerenza estetica in tutta l'app.
- **Color Accessibility e Feedback Non Bloccanti:** I colori associati ai trattamenti in agenda vengono resi tramite piccoli "dot" per non compromettere il contrasto tra testo e background. Le conferme distruttive (es. cancellazione di un appuntamento) sfruttano dialog non bloccanti sviluppati con Vue per mantenere l'utente focalizzato senza alert intrusivi del browser.
- **Responsività:** L'interfaccia è adattiva. Pur essendo ottimizzata per la postazione desktop della reception, scala perfettamente in caso di utilizzo via tablet o smartphone in mobilità.

## 8. Installazione e Documentazione

Essendo basato su SQLite come Database, il progetto è "plug-and-play" e non richiede l'installazione e configurazione di DB esterni (come MySQL o MongoDB).

**Procedura di avvio:**

1. Clonare il repository del progetto in locale:
   ```bash
   git clone https://github.com/Nick-2002b/Gestionale-Estetista.git
   ```
2. Aprire **due** sessioni del terminale.
3. Nel primo terminale (Backend), posizionarsi nella cartella e installare le dipendenze:
   ```bash
   cd backend
   npm i
   ```
4. Avviare il backend (questo comando creerà automaticamente il database `database.sqlite` e le relative tabelle se non esistono):
   ```bash
   npm run dev
   ```
5. Nel secondo terminale (Frontend), posizionarsi nella cartella e installare le dipendenze:
   ```bash
   cd frontend
   npm i
   ```
6. Avviare il frontend:
   ```bash
   npm run dev
   ```
7. Aprire il browser all'indirizzo `localhost` mostrato nel terminale di frontend per iniziare ad utilizzare l'applicativo.

**Documentazione Esterna Utile:**

- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [FullCalendar](https://fullcalendar.io/docs)
- [Heroicons](https://heroicons.com/outline)
