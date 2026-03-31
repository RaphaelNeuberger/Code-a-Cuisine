













# Code à Cuisine

Code à Cuisine ist eine smarte Webanwendung, die mithilfe von KI und Automatisierung aus vorhandenen Zutaten automatisch passende Rezepte generiert. Ziel ist es, Lebensmittelverschwendung zu reduzieren und abwechslungsreiche, gesunde Rezepte für Hobbyköche und WGs bereitzustellen. Alle generierten Rezepte werden in einer öffentlichen Bibliothek gespeichert und sind für alle Nutzer einsehbar.

## Features
- Zutaten-Eingabe mit Mengenangabe und Autocomplete
- Portions- und Zeitwahl, Kochstil- und Diätfilter
- KI-gestützte Rezeptvorschläge (mind. 70% Zutaten genutzt, max. 3 fehlende Basiszutaten)
- Workflow-optimierte Schritt-für-Schritt-Anleitung, Arbeitsaufteilung für Kochhelfer
- Nährwertanalyse pro Portion und Rezept
- IP-basiertes Quota-System (max. 3 Rezepte/Tag/IP, 12 systemweit)
- Rezepte-Bibliothek mit Filter, Paginierung und Detailansicht
- Responsive Design für Desktop, Tablet, Smartphone
- Firebase-Anbindung für Rezept-Speicherung
- N8N-Workflows für KI, Validierung, Logging und Quota

## Projektstruktur & Tech-Stack
- Frontend: Angular, SCSS, semantisches HTML, TypeScript (Clean Code, JSDoc)
- Backend/Automatisierung: n8n (Workflows, Logging, Quota)
- Datenbank: Firebase

## User Stories (Auszug)
1. Zutaten-Eingabe mit Mengen und Übersicht
2. Portions- und Zeitangabe, Kochstil- und Diätfilter
3. KI-gestützte Rezeptvorschläge (3 Varianten)
4. Workflow-optimierte Anleitung, Arbeitsaufteilung für Kochhelfer
5. Nährwertanalyse pro Portion und Rezept
6. Quota- und Rate-Limiting pro IP
7. Öffentliche Rezepte-Bibliothek mit Filter & Detailansicht

Siehe vollständige Checkliste im Projekt.

## Entwicklung

### Development server

```bash
ng serve
```

Die App läuft dann unter `http://localhost:4200/` und lädt bei Änderungen automatisch neu.

### Code scaffolding

```bash
ng generate component component-name
```

Weitere Schematics siehe `ng generate --help`.

### Build

```bash
ng build
```

Build-Artefakte liegen im `dist/`-Verzeichnis.

### Tests

```bash
ng test
```

### Linting

```bash
ng lint
```

## Lizenz
MIT

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
