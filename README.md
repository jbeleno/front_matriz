# front_matriz — Frontend para gestión de matrices de riesgo

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.9-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testing-library&logoColor=white)](https://testing-library.com/)

UI para administrar **matrices de riesgo** organizacionales: empresas, usuarios, riesgos, objetivos afectados, fases, impactos, probabilidades. Pareja con [`Back_matriz`](https://github.com/jbeleno/Back_matriz).

> Proyecto académico (USCO). Implementa control de roles (administrador / evaluador) con rutas protegidas y CRUDs por entidad.

---

## Highlights

- 🛡️ **Routing por roles** — `AdminRoute` protege rutas administrativas; `HomeEvaluador` para evaluadores.
- 📋 **CRUDs por entidad** — empresas, usuarios, matrices, riesgos, objetivos afectados, fases, impactos, probabilidades.
- ✉️ **Verificación pendiente** — flujo de email para confirmar cuenta antes de habilitar funciones.
- 🌐 **API URL configurable** vía `REACT_APP_API_URL` (sin hardcoding).

## Stack

| Categoría | Tecnología |
|---|---|
| UI | React 19 |
| Routing | React Router DOM 7 |
| HTTP | Axios |
| Tests | Testing Library (DOM, React, jest-dom, user-event) |
| Build | Create React App 5 |

---

## Quick start

```bash
git clone https://github.com/jbeleno/front_matriz.git
cd front_matriz

cp .env.example .env
# Editar .env con la URL del backend (default: http://localhost:8000)

npm install
npm start
# → http://localhost:3000
```

> Requiere [`Back_matriz`](https://github.com/jbeleno/Back_matriz) corriendo.

## Scripts

| Comando | Acción |
|---|---|
| `npm start` | Dev server con hot reload |
| `npm run build` | Build de producción |
| `npm test` | Tests con Jest + Testing Library |
| `npm run eject` | Expone configuración CRA (irreversible) |

---

## Estructura

```
front_matriz/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.js                       # Form de login
│   │   ├── Register.js                    # Form de registro
│   │   ├── VerificacionPendiente.js       # Verificación por email
│   │   ├── AdminRoute.js                  # HOC: protege rutas de admin
│   │   ├── Admin.js                       # Dashboard admin
│   │   ├── HomeEvaluador.js               # Vista evaluador
│   │   ├── EmpresasCrud.js                # CRUD empresas
│   │   ├── UsuariosCrud.js                # CRUD usuarios
│   │   ├── MatricesCrud.js                # CRUD matrices
│   │   ├── RiesgosCrud.js                 # CRUD riesgos
│   │   ├── ImpactosCrud.js                # CRUD impactos
│   │   ├── ProbabilidadesCrud.js          # CRUD probabilidades
│   │   ├── ObjetivosAfectadosCrud.js      # CRUD objetivos afectados
│   │   ├── ObjetivosAfectadosPorMatriz.js # Vista por matriz
│   │   ├── FasesAfectadasCrud.js          # CRUD fases
│   │   ├── CrearMatriz.js                 # Wizard creación
│   │   ├── CrearRiesgos.js                # Wizard de riesgos
│   │   └── DetalleMatriz.js               # Detalle de una matriz
│   ├── api.js                             # Cliente axios + endpoints
│   ├── App.js                             # Configuración de rutas
│   └── styles/                            # CSS por componente
├── .env.example
└── package.json
```

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `REACT_APP_API_URL` | URL del backend FastAPI | `http://localhost:8000` |

---

## Backend

API REST: [Back_matriz](https://github.com/jbeleno/Back_matriz) — FastAPI + SQLAlchemy + PostgreSQL.

---

## Mejoras pendientes (deuda técnica reconocida)

- **Migrar de CRA a Vite**: Create React App está [oficialmente deprecado desde 2025](https://github.com/facebook/create-react-app).
- **TypeScript**: tipado fuerte para los modelos del dominio (Matriz, Riesgo, Empresa, etc.) y para las respuestas de la API.
- **Capa de servicios estructurada**: hoy `api.js` solo tiene `login`/`register`; el resto de las operaciones se hacen con axios inline en los componentes. Extraer a `services/` por entidad.
- **Estado global**: con CRUDs interconectados, considerar `react-query` o Zustand para caching y sincronización en lugar de fetches manuales.
- **Tests**: existen las dependencias de Testing Library pero no hay tests escritos. Agregar al menos por `AdminRoute`, `Login`, `Register`.
- **Manejo centralizado de errores y loading states**: hoy probablemente esté disperso en cada componente.
- **Variables de entorno**: separar `.env.development` / `.env.production` para distintos backends.

---

## Licencia

Proyecto académico — Universidad Surcolombiana (USCO).
