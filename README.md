# PetMatch — Angular Final Project

Клиент–сървър приложение за осиновяване на животни с публична зона, защитени страници, роли (User/Shelter), пълен CRUD за животни, заявки за осиновяване и удобен UX. Включени са и бонуси: „Near me“ (Geolocation + Canvas + SVG), леки анимации и unit тестове.

---

## Технологии и библиотеки

**Frontend (Angular)**
- Angular 19 (standalone components, Angular Router)
- TypeScript, RxJS 7 (Observables + оператори: switchMap, tap, catchError, retryWhen и др.)
- HttpClient + Interceptors: error, logging, retry, auth token
- Guards: authGuard, roleGuard, guestGuard
- Custom Pipes: age, truncate (с unit тестове)
- Angular Animations (appearance за каталог)
- HTML5: Geolocation + Canvas + SVG (страница “Near me”)
- Karma + Jasmine (unit тестове за компоненти и пайпове)
- Външни CSS файлове, responsive grid

**Backend (REST API)**
- Node.js + Express
- cookie-parser, cors, body parsing
- Auth с httpOnly cookie
- Роутери/контролери: auth, animals, adoptionRequests, users
- Данни: JSON файл `Rest-api/db/db.json`

**(Опционално) Деплой**
- Netlify конфигурация за клиента (`netlify.toml`)
- Vercel конфигурация за API (`vercel.json`)

---

## Инструкции за стартиране

### 1) REST API
    cd Rest-api
    npm install
    npm start
    # API: http://localhost:3000

- CORS е разрешен за `http://localhost:4200`.
- Сървърът използва httpOnly cookie за сесия.

### 2) Angular клиент
    cd pet-match
    npm install
    npm start / ng serve
    # App: http://localhost:4200

(Ако липсва пакетът за анимации: `npm i @angular/animations@^19`.)

### 3) Тестове
    npm test

---

## Архитектура и функционалност

### Структура (накратко)
    src/app
    /features
    /home
    /auth/(login|register)
    /animals/(animals-board|animal-item|animal-details|create-animal|animal-edit|favourite-animals|my-animals)
    /adoption/(apply|my-requests|shelter-requests)
    /geo (Near me)
    /profile
    /core
    /services (auth, animals, adoption, profile, ...)
    /guards (auth|role|guest)
    /interceptors (error|logging|retry|authToken)
    /shared
    /components (header, not-found, ...)
    /pipes (age, truncate)


### Роутинг (основни)
- Публични: `/home`, `/animals`, `/animals/:id`, `/geo`, `/**` (NotFound)
- Само за гости: `/login`, `/register` (guestGuard)
- Само за логнати: `/favorites`, `/my-requests`, `/profile` (authGuard)
- Само Shelter: `/animals/create`, `/animals/edit/:id`, `/my-animals`, `/requests` (authGuard + roleGuard)
- Кандидатстване: `/adopt/:animalId` (authGuard)

### Ключови екрани и логика
- **Каталог** – списък животни + детайли; филтър по град чрез `?city=...` и бейдж “Filtered by city … / Clear”.
- **CRUD за Animals** – Create/Read/Update/Delete; Update/Delete **само от автора (Shelter)**.
- **Favorites** – добавяне/махане от любими; отделен списък.
- **Adoption** – форма за кандидатстване; списъци заявки (мои и към приюта).
- **Near me** – геолокация (локално в браузъра), изчислява близки градове (вкл. Gotse Delchev) и предлага бърз филтър към каталога.
- **Session** – състояние на вход остава след рефреш (cookie + localStorage).

### Angular концепции
- TypeScript типове/интерфейси: `Animal`, `User`, `AdoptionRequest`, др.
- RxJS: switchMap, tap, catchError, retryWhen, mergeMap, timer, …
- Lifecycle hooks: ngOnInit, ngAfterViewInit (Geo)
- Pipes: age, truncate (с unit тестове)
- Guards: authGuard, roleGuard, guestGuard
- Interceptors: централизирана обработка на грешки, retry, логване, токен

### REST API (накратко)
- **Auth**: регистрация/вход с httpOnly cookie
- **Animals**:
  - GET `/animals` – каталог
  - GET `/animals/:id` – детайл
  - POST `/animals` – create (Shelter)
  - PUT `/animals/:id` – update (само автор)
  - DELETE `/animals/:id` – delete (само автор)
  - Любими: POST `/animals/:id/favorite`, DELETE `/animals/:id/favorite`
- **AdoptionRequests**:
  - POST `/adoption-requests` – кандидатстване
  - GET `/adoption-requests/mine` – заявки на потребителя
  - GET `/adoption-requests/shelter` – заявки към моите животни (Shelter)
  - PATCH `/adoption-requests/:id` – одобрение/отказ
- **Users**: профилни данни, GET `/users/me`

---

## Послание към оценяващите

Надявам се PetMatch да ви хареса. Приятно разглеждане и благодаря за вниманието!



