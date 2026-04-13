# Code à Cuisine

Code à Cuisine is a smart web application that uses AI and automation to automatically generate fitting recipes from available ingredients. The goal is to reduce food waste and provide varied, healthy recipes for home cooks and shared households. All generated recipes are stored in a public library and are visible to all users.

## Features

- Ingredient input with quantity and autocomplete
- Serving size and time selection, cooking style and diet filters
- AI-powered recipe suggestions (min. 70% of ingredients used, max. 3 missing staple ingredients)
- Workflow-optimised step-by-step instructions, task distribution for cooking assistants
- Nutritional analysis per serving and recipe
- IP-based quota system (max. 3 recipes/day/IP, 12 system-wide)
- Recipe library with filter, pagination and detail view
- Responsive design for desktop, tablet and smartphone
- Firebase integration for recipe storage
- n8n workflows for AI, validation, logging and quota management

## Tech Stack

- **Frontend:** Angular, SCSS, semantic HTML, TypeScript (Clean Code, JSDoc)
- **Backend / Automation:** n8n (workflows, logging, quota)
- **Database:** Firebase

## User Stories

1. Ingredient input with quantities and overview
2. Serving size and time selection, cooking style and diet filters
3. AI-powered recipe suggestions (3 variants)
4. Workflow-optimised instructions, task distribution for cooking assistants
5. Nutritional analysis per serving and recipe
6. Quota and rate limiting per IP
7. Public recipe library with filter & detail view

## Development

### Development server

```bash
ng serve
```

The app runs at `http://localhost:4200/` and reloads automatically on file changes.

### Code scaffolding

```bash
ng generate component component-name
```

For more schematics see `ng generate --help`.

### Build

```bash
ng build
```

Build artefacts are placed in the `dist/` directory.

### Running unit tests

```bash
ng test
```

### Linting

```bash
ng lint
```

### End-to-end tests

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License

MIT
